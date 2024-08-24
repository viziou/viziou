import { useContext, useState } from 'react';
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

import Scene2D from '../components/Scene2D';
import { PolygonData } from '../utils/types';
import { PolygonContext } from '../contexts/PolygonContext';
import '../styles/TwoDEnv.css';

import { Storage } from '../backend/Interface';

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
            position: [
                Math.random() * 4 - 2, // x coordinate
                Math.random() * 4 - 2, // y coordinate
            ],
            colour: getRandomColour(),
        };

        console.log("Dispatching ADD_RANDOM_POLYGON:", newPolygon);
        dispatch({ type: "ADD_RANDOM_POLYGON", payload: newPolygon });
    };

    const clearPolygons = () => {
        console.log("Dispatching CLEAR_POLYGONS");
        dispatch({ type: "CLEAR_POLYGONS" });
    };

    const savePolygons = () => {
      console.log("Saving canvas...");
      Storage.save(polygons, 'export');
    }
    const loadPolygons = async () => {
        console.log("Opening file dialog...");
        const polygonData = await Storage.load()
        console.log(polygonData)
        if (polygonData) {
            console.log("Dispatching SET_POLYGONS");
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
