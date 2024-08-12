import { useContext } from 'react';
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

import Scene2D from '../components/Scene2D';
import { PolygonData } from '../utils/types';
import { PolygonContext } from '../contexts/PolygonContext';
import '../styles/TwoDEnv.css';

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

    return (
        <div className="TwoDEnv">
            <main>
                <div className="canvas-container">
                    <Scene2D polygons={polygons} />
                </div>
            </main>

            <div className="button-container">
                <button onClick={addRandomPolygon}>Add Random Polygon</button>
                <button onClick={addSquare}>Add Square</button>
                <button onClick={clearPolygons}>Clear Shapes</button>

                <button>Add Custom Shape</button>
                <button>Export Scene</button>
                <button>Import Shape</button>
            </div>

      </div>
    );
};

export default TwoDEnv;
