import { useContext, useRef, useState } from 'react'
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

import Scene2D from '../components/Scene2D';
import { IOUPolygonData, PolygonData } from '../utils/types'
import { PolygonContext } from '../contexts/PolygonContext';
import '../styles/TwoDEnv.css';

import { Backend2D, Storage } from '../backend/Interface';

import { generatePairs } from '../utils/Generic';
import { IOUPolygonContext } from '../contexts/IOUPolygonContext.tsx'

const getSquare = (): THREE.PlaneGeometry => {
    return new THREE.PlaneGeometry(1, 1);
};

const getRandomGeometry = (): ConvexGeometry => {
    // random number of vertices between 5 and 12
    const numVertices = Math.floor(Math.random() * 8) + 5;
    const points = [];

    for (let i = 0; i < numVertices; i++) {
      points.push(new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 4 - 2, 0));
    }

    //console.log('number of points: ' + points.length)
    //console.log('added points: ', points)

    return new ConvexGeometry(points);
};

// generate random hex colours
const getRandomColour = (): string => {
    const letters = "0123456789ABCDEF";
    let colour = "#";

    for (let i = 0; i < 6; i++) {
        colour += letters[Math.floor(Math.random() * 16)];
    }

    return colour;
};

const TwoDEnv = () => {
    const context = useContext(PolygonContext);
    const IoUcontext = useContext(IOUPolygonContext)

    const nonceGenerator = useRef(0);

    const generateId = () => {
      nonceGenerator.current += 1
      return nonceGenerator.current
    }

    if (!context?.dispatch || !IoUcontext?.dispatch) {
        throw new Error("TwoDEnv must be used within a PolygonProvider");
    }

    const { polygons, dispatch } = context;
    const { polygonMap: iouPolygons, dispatch: iouDispatch } = IoUcontext;

    const addSquare = () => {
        const newPolygon: PolygonData = {
            geometry: getSquare(),
            position: [
                Math.random() * 4 - 2, // x coordinate
                Math.random() * 4 - 2 // y coordinate
            ],
            colour: getRandomColour(),
            id: generateId(),
            opacity: 1.0
        };

        console.log("Dispatching ADD_SQUARE:", newPolygon);
        dispatch({ type: "ADD_SQUARE", payload: newPolygon });
    };

    const addRandomPolygon = () => {
        const newPolygon: PolygonData = {
            geometry: getRandomGeometry(),
            position: [0, 0
            //    Math.random() * 4 - 2, // x coordinate
            //    Math.random() * 4 - 2, // y coordinate
            ],
            colour: getRandomColour(),
            id: generateId(),
            opacity: 1,
        };

        console.log("Dispatching ADD_RANDOM_POLYGON:", newPolygon);
        dispatch({ type: "ADD_RANDOM_POLYGON", payload: newPolygon });
        // const geometryPosition = newPolygon.geometry.getAttribute('position');
        // for (let i = 0, l = geometryPosition.count; i < l; i+=3 ) {
        //   const newPoint: PolygonData = {
        //     geometry: new THREE.CircleGeometry(0.02, 50),
        //     position: [geometryPosition.array[i], geometryPosition.array[i + 1]],
        //     colour: '#C81400'
        //   }
        //   console.log("Dispatching ADD_POINT:")
        //   //dispatch({ type: "ADD_POINT", payload: newPoint });
        // }
        console.time('Calculating Area of Polygon')
        console.log("Area of new random polygon: ", Backend2D.area(newPolygon));
        console.timeEnd('Calculating Area of Polygon');
        console.time('Calculating Centroid');
        const {x, y} = Backend2D.centreOfMass(newPolygon);
        console.log('Centroid: (', x, ', ', y, ')');
        console.time('Calculating Centroid');
        console.log('Reducing polygon...');
        const result = Backend2D.reduceThreeGeometry(newPolygon);
        console.log('reduced polygon: ', result);
        // for (const vertex of result.vertices) {
        //   const newPoint: PolygonData = {
        //     geometry: new THREE.CircleGeometry(0.02, 50),
        //     position: [vertex.x, vertex.y],
        //     colour: '#0dc800'
        //   }
        //   //dispatch({ type: "ADD_POINT", payload: newPoint })
        // }
    };

    const clearPolygons = () => {
        console.log("Dispatching CLEAR_POLYGONS");
        dispatch({ type: "CLEAR_POLYGONS" });
        iouDispatch({ type: "CLEAR_POLYGONS" }); // clear IoUs as well
    };

    const showIoUs = () => {
        const IoUs: IOUPolygonData[] = [];
        for (const [a, b] of generatePairs(Array.from(polygons.values()))) {
          const {area, shape} = Backend2D.IoU(a, b);
          console.log("IoU between " + a.id + " and " + b.id + ": " + area);
          console.log("IoU shape: ", shape)
          // TODO: don't push an IoU polygon if area is 0?
            const IoUPolygon: IOUPolygonData = {
              parentIDa: a.id,
              parentIDb: b.id,
              geometry: shape,
              position: [0, 0],
              colour: '#ce206b',
              id: generateId(),
              opacity: 1.0,
            }
            IoUs.push(IoUPolygon);
        }
        //console.log("Clearing canvas...");
        //dispatch({type: "CLEAR_POLYGONS"});
        for (const polygon of IoUs) {
          console.log("Dispatching IoU Polygon via SET_POLYGON...", polygon);
          iouDispatch({ type: 'SET_POLYGON', payload: polygon });
          const geomPos = polygon.geometry.getAttribute('position')
          // for (let i = 0, l = geomPos.count; i < l; i += 3) {
          //   const newPoint: PolygonData = {
          //     geometry: new THREE.CircleGeometry(0.02, 50),
          //     position: [geomPos.array[i], geomPos.array[i + 1]],
          //     colour: '#2bc800',
          //     id: this.geometry.id // dirty hack since we don't have an ID generator
          //   }
          //   console.log("Placing IoU vertex:")
          //   dispatch({ type: "ADD_POINT", payload: newPoint });
          // }
        }
    }

    const savePolygons = () => {
      console.log("Saving canvas...");
      Storage.save2D(Array.from(polygons.values()), 'export');
    }
    const loadPolygons = async () => {
        console.log("Opening file dialog...");
        const polygonData = await Storage.load2D()
        console.log(polygonData)
        if (polygonData) {
            console.log("Dispatching SET_POLYGONS");
            console.log('testing count: ', polygonData[0].geometry.getAttribute('position').count)
            console.log('triangulation count: ', polygonData[0].geometry.attributes.position.array.length)
            dispatch({ type: "SET_POLYGONS", payload: polygonData });
        }
    }

    const [overflowVisible, setOverflowVisible] = useState(false);

    const toggleOverflowMenu = () => {
        setOverflowVisible(!overflowVisible);
    };

    const closeOverflowMenu = () => {
        setOverflowVisible(false);
    };

    return (
        <div className="TwoDEnv">
            <main>
                <div className="twod-canvas-container">
                    <Scene2D polygons={polygons} iouPolygons={iouPolygons} iouDispatch={iouDispatch} />
                </div>
            </main>

            <div className="twod-button-container">
                <button className="twod-button" onClick={addRandomPolygon}>Add Random Polygon</button>
                <button className="twod-button" onClick={addSquare}>Add Square</button>
                <button className="twod-button" onClick={clearPolygons}>Clear Shapes</button>
                <button className="twod-button" onClick={showIoUs}>Show IoUs</button>

                <button className="overflow-button" onClick={toggleOverflowMenu}>⋮</button>
                <div className={`overflow-menu ${overflowVisible ? 'show' : ''}`}>
                    <button className="twod-button" onClick={() => { closeOverflowMenu(); }}>Add Custom Shape</button>
                    <button className="twod-button" onClick={() => { closeOverflowMenu(); savePolygons() }}>Export Scene</button>
                    <button className="twod-button" onClick={() => { closeOverflowMenu(); loadPolygons() }}>Import Scene</button>
                </div>

            </div>

        </div>
    );
};

export default TwoDEnv;
