import { useContext, useState } from 'react';
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

import Scene2D from '../components/Scene2D';
import { PolygonData } from '../utils/types';
import { PolygonContext } from '../contexts/PolygonContext';
import '../styles/TwoDEnv.css';

import { Backend2D, Storage } from '../backend/Interface';

import { generatePairs } from '../utils/Generic';

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

    console.log('number of points: ' + points.length)

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

    if (!context?.dispatch) {
        throw new Error("TwoDEnv must be used within a PolygonProvider");
    }

    const { polygons, dispatch } = context;

    const addSquare = () => {
        const newPolygon: PolygonData = {
            geometry: getSquare(),
            position: [
                Math.random() * 4 - 2, // x coordinate
                Math.random() * 4 - 2 // y coordinate
            ],
            colour: getRandomColour(),
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
        };

        console.log("Dispatching ADD_RANDOM_POLYGON:", newPolygon);
        dispatch({ type: "ADD_RANDOM_POLYGON", payload: newPolygon });
        const geometryPosition = newPolygon.geometry.getAttribute('position');
        for (let i = 0, l = geometryPosition.count; i < l; i+=3 ) {
          const newPoint: PolygonData = {
            geometry: new THREE.CircleGeometry(0.02, 50),
            position: [geometryPosition.array[i], geometryPosition.array[i+1]],
            colour: '#C81400'
        }
        console.log("Dispatching ADD_POINT:")
        dispatch( { type: "ADD_POINT", payload: newPoint });
        console.time('Calculating Area of Polygon')
        console.log("Area of new random polygon: ", Backend2D.area(newPolygon));
        console.timeEnd('Calculating Area of Polygon');
        console.time('Calculating Centroid');
        const {x, y} = Backend2D.centreOfMass(newPolygon);
        console.log('Centroid: (', x, ', ', y, ')');
        console.time('Calculating Centroid')
      }

    };

    const clearPolygons = () => {
        console.log("Dispatching CLEAR_POLYGONS");
        dispatch({ type: "CLEAR_POLYGONS" });
    };

    const showIoUs = () => {
        const IoUs: PolygonData[] = [];
        for (const [a, b] of generatePairs(polygons)) {
          const {area, shape} = Backend2D.IoU(a, b);
          console.log("IoU between " + a.geometry.id + " and " + b.geometry.id + ": " + area);
          if (1 == 1) {
            const IoUPolygon: PolygonData = {
              geometry: shape,
              position: [0, 0],
              colour: '#ce206b'
            }
            IoUs.push(IoUPolygon);
          }
        }
        //console.log("Clearing canvas...");
        //dispatch({type: "CLEAR_POLYGONS"});
        for (const polygon of IoUs) {
          console.log("Dispatching IoU Polygon via ADD_RANDOM_POLYGON...", polygon);
          dispatch({type: 'ADD_RANDOM_POLYGON', payload: polygon});
        }

    }

    const savePolygons = () => {
      console.log("Saving canvas...");
      Storage.save2D(polygons, 'export');
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
                    <Scene2D polygons={polygons} />
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
