import { useContext, useRef, useState } from 'react'
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

import Scene3D from '../components/Scene3D';
import { IOUPolyhedronData, PolyhedronData } from '../utils/types'
import { PolyhedronContext } from '../contexts/PolyhedronContext';
import '../styles/ThreeDEnv.css';
import { Backend3D, Storage } from '../backend/Interface.ts'
import Sidebar3D from '../components/Sidebar3D.tsx';
import ConfirmationModal from '../modals/ConfirmationModal.tsx';
import { IOUPolyhedronContext } from '../contexts/IOUPolyhedronContext.tsx'
import { generatePairs } from '../utils/Generic.ts'

// const getCube = (): THREE.BoxGeometry => {
//     return new THREE.BoxGeometry(1, 1, 1);
// };

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
    const IoUcontext = useContext(IOUPolyhedronContext)

    const nonceGenerator = useRef(0);

    const generateId = () => {
      nonceGenerator.current += 1
      return nonceGenerator.current
    }

    if (!context?.dispatch || !IoUcontext?.dispatch) {
        throw new Error("ThreeDEnv must be used within a PolyhedronProvider");
    }

    const { polyhedra, dispatch, confirmationInfo, } = context;
    const { polyhedronMap: iouPolyhedrons, dispatch: iouDispatch } = IoUcontext

    const [selectedId, setSelectedId] = useState<number | null>(null);


    // const addCube = () => {
    //     const newPolyhedron: PolyhedronData = {
    //         geometry: getCube(),
    //         position: [
    //             Math.random() * 4 - 2,
    //             Math.random() * 4 - 2,
    //             Math.random() * 4 - 2
    //         ],
    //         rotation: [0, 0, 0],
    //         scale: [1, 1, 1],
    //         colour: getRandomColour(),
    //     };

    //     console.log("Dispatching ADD_CUBE:", newPolyhedron);
    //     dispatch({ type: "ADD_CUBE", payload: newPolyhedron });
    // };

    const addRandomPolyhedron = () => {
        const newPolyhedron: PolyhedronData = {
            id: generateId(),
            geometry: getRandomGeometry(),
            position: [
                Math.random() * 4 - 2,
                Math.random() * 4 - 2,
                Math.random() * 4 - 2
            ],
            rotation: [0, 0, 0, 'ZYX'],
            scale: [1, 1, 1],
            colour: getRandomColour(),
            opacity: 0.5,
            generateId: generateId
        };

        console.log("Dispatching ADD_RANDOM_POLYHEDRON:", newPolyhedron);
        dispatch({ type: "ADD_RANDOM_POLYHEDRON", payload: newPolyhedron });
    };

    const clearPolyhedra = () => {
        console.log("Dispatching CLEAR_POLYHEDRA");
        dispatch({ type: "SELECT_POLYHEDRON", id: null });
        dispatch({ type: "CLEAR_POLYHEDRA" });
    };

    const savePolyhedra = () => {
      console.log("Saving canvas...");
      Storage.save3D(Array.from(polyhedra.values()), 'export');
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

  const showIoUs = () => {
    const IoUs: IOUPolyhedronData[] = [];
    for (const [a, b] of generatePairs(Array.from(polyhedra.values()))) {
      const { area, shape } = Backend3D.IoU(a, b);
      console.log("IoU between " + a.id + " and " + b.id + ": " + area);
      console.log("IoU shape: ", shape)
      // TODO: don't push an IoU polygon if area is 0?
      const IoUPolyhedra: IOUPolyhedronData = {
        parentIDa: a.id,
        parentIDb: b.id,
        rotation: [0, 0, 0, 'ZYX'],
        scale: [1, 1, 1],
        geometry: shape,
        position: [0, 0, 0],
        colour: '#ce206b',
        id: generateId(),
        opacity: 1.0,
        generateId: generateId
      }
      IoUs.push(IoUPolyhedra);
    }
    //console.log("Clearing canvas...");
    //dispatch({type: "CLEAR_POLYGONS"});
    for (const polyhedron of IoUs) {
      console.log("Dispatching IoU Polyhedra via SET_POLYHEDRA...", polyhedron);
      iouDispatch({ type: 'SET_POLYHEDRON', payload: polyhedron });
      //const geomPos = polygon.geometry.getAttribute('position')
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

  const clearIoUs = () => {
    console.log("Clearing IoU polyhedrons...");
    iouDispatch({ type: "CLEAR_POLYHEDRONS" });
  }

    return (

        <div className="ThreeDEnv">

            <Sidebar3D
                polyhedrons={Array.from(polyhedra.values())}
                addRandomPolyhedron={addRandomPolyhedron}
                clearPolyhedrons={clearPolyhedra}
                savePolyhedrons={savePolyhedra}
                loadPolyhedrons={loadPolyhedra}
                showIoUs={showIoUs}
                clearIoUs={clearIoUs}
            />

            <main className="threed-canvas-container">
                <Scene3D
                polyhedra={polyhedra}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                iouPolyhedrons={iouPolyhedrons}
                iouDispatch={iouDispatch}
                generateId={generateId}
                />
            </main>
            <ConfirmationModal
                isOpen={confirmationInfo.isOpen}
                message={confirmationInfo.message}
                description={confirmationInfo.description}
                onConfirm={confirmationInfo.onConfirm}
                onClose={confirmationInfo.onClose}
            />
        </div>
    );
};

export default ThreeDEnv;
