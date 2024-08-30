import { useContext, useState } from 'react';
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

import Scene3D from '../components/Scene3D';
import { PolyhedronData } from '../utils/types';
import { PolyhedronContext } from '../contexts/PolyhedronContext';
import '../styles/ThreeDEnv.css';
import { Storage } from '../backend/ts/Interface.ts'

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
        throw new Error("ThreeDEnv must be used within a PolyhedronProvider");
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

    const savePolyhedra = () => {
      console.log("Saving canvas...");
      Storage.save3D(polyhedra, 'export');
    }
    const loadPolyhedra = async () => {
      console.log("Opening file dialog...");
      const polyhedronData = await Storage.load3D()
      console.log(polyhedronData)
      if (polyhedronData) {
        console.log("Dispatching SET_POLYHEDRON");
        dispatch({ type: "SET_POLYHEDRONS", payload: polyhedronData });
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
        <div className="ThreeDEnv">
            <main>
                <div className="threed-canvas-container">
                    <Scene3D polyhedra={polyhedra} />
                </div>
            </main>

            <div className="threed-button-container">
                <button className="threed-button" onClick={addRandomPolyhedron}>Add Random Polyhedron</button>
                <button className="threed-button" onClick={addCube}>Add Cube</button>
                <button className="threed-button" onClick={clearPolyhedra}>Clear Shapes</button>

                <button className="overflow-button" onClick={toggleOverflowMenu}>⋮</button>
                <div className={`overflow-menu ${overflowVisible ? 'show' : ''}`}>
                    <button className="threed-button" onClick={() => { closeOverflowMenu(); }}>Add Custom Shape</button>
                    <button className="threed-button" onClick={() => { closeOverflowMenu(); savePolyhedra() }}>Export Scene</button>
                    <button className="threed-button" onClick={() => { closeOverflowMenu(); loadPolyhedra() }}>Import Scene</button>
                </div>

            </div>

        </div>
    );
};

export default ThreeDEnv;
