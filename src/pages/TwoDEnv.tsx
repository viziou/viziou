import { useState } from 'react';
import * as THREE from 'three';
import Scene2D from '../components/Scene2D';
import { PolygonData } from '../utils/types';
import '../styles/TwoDEnv.css';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

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
    const letters = '0123456789ABCDEF';
    let colour = '#';

    for (let i = 0; i < 6; i++) {
        colour += letters[Math.floor(Math.random() * 16)];
    }

    return colour;
};

const TwoDEnv = () => {
    const [polygons, setPolygons] = useState<PolygonData[]>([]);

    const addSquare = () => {
        const newPolygon: PolygonData = {
            geometry: getSquare(),
            position: [
                Math.random() * 4 - 2, // x coordinate
                Math.random() * 4 - 2, // y coordinate
            ],
            colour: getRandomColour(),
        };

        setPolygons([...polygons, newPolygon]);
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
        setPolygons([...polygons, newPolygon]);
    };

    const clearPolygons = () => {
        setPolygons([]);
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
