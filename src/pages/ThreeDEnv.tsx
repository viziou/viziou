import { useContext } from 'react';
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

import Scene3D from '../components/Scene3D';
import { PolyhedronData } from '../utils/types';
import { PolyhedronContext } from '../contexts/PolyhedronContext';
import '../styles/ThreeDEnv.css';

const getCube = (): THREE.BoxGeometry => {
    return new THREE.BoxGeometry(1, 1, 1);
};

const getRandomGeometry = (): ConvexGeometry => {
    const numVertices = Math.floor(Math.random() * 8) + 5;
    const points = [];

    for (let i = 0; i < numVertices; i++) {
        points.push(new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2));
    }

    return new ConvexGeometry(points);
};

const getRandomColour = (): string => {
    const letters = "0123456789ABCDEF";
    let colour = "#";

    for (let i = 0; i < 6; i++) {
        colour += letters[Math.floor(Math.random() * 16)];
    }

    return colour;
};

const ThreeDEnv = () => {
    const context = useContext(PolyhedronContext);

    if (!context?.dispatch) {
        throw new Error("TwoDEnv must be used within a PolyhedronProvider");
    }

    const { polyhedra, dispatch } = context;

    const addCube = () => {
        const newPolyhedron: PolyhedronData = {
            geometry: getCube(),
            position: [
                Math.random() * 4 - 2, 
                Math.random() * 4 - 2, 
                Math.random() * 4 - 2
            ],
            colour: getRandomColour(),
        };

        console.log("Dispatching ADD_CUBE:", newPolyhedron);
        dispatch({ type: "ADD_CUBE", payload: newPolyhedron });
    };

    const addRandomPolyhedron = () => {
        const newPolyhedron: PolyhedronData = {
            geometry: getRandomGeometry(),
            position: [
                Math.random() * 4 - 2, 
                Math.random() * 4 - 2, 
                Math.random() * 4 - 2
            ],
            colour: getRandomColour(),
        };

        console.log("Dispatching ADD_RANDOM_POLYHEDRON:", newPolyhedron);
        dispatch({ type: "ADD_RANDOM_POLYHEDRON", payload: newPolyhedron });
    };

    const clearPolyhedra = () => {
        console.log("Dispatching CLEAR_POLYHEDRA");
        dispatch({ type: "CLEAR_POLYHEDRA" });
    };

    return (
        <div className="ThreeDEnv">
            <main>
                <div className="canvas-container">
                    <Scene3D polyhedra={polyhedra} />
                </div>
            </main>

            <div className="button-container">
                <button onClick={addRandomPolyhedron}>Add Random Polyhedron</button>
                <button onClick={addCube}>Add Cube</button>
                <button onClick={clearPolyhedra}>Clear Shapes</button>
                
                <button>Add Custom Shape</button>
                <button>Export Scene</button>
                <button>Import Shape</button>
            </div>
        </div>
    );
};

export default ThreeDEnv;
