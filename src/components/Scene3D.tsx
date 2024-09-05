import * as THREE from 'three';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { useState, useRef, useContext } from 'react';

import Polyhedron from './Polyhedron';
import { PolyhedronContext } from '../contexts/PolyhedronContext';

const Scene3D = () => {
    const context = useContext(PolyhedronContext);

    if (!context?.dispatch) {
        throw new Error("Scene3D must be used within a PolyhedronProvider");
    }    
    
    const { dispatch, polyhedra: statePolyhedra } = context;

    // track the selected polyhedron by index for state
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
    // ref for the TransformControls
    const selectedObject = useRef<THREE.Object3D | null>(null); 

    const [controlsEnabled, setControlsEnabled] = useState(true); 
    const transformControlRef = useRef(null); 

    // toggle selection of polyhedron
    const handleObjectClick = (event: ThreeEvent<MouseEvent>, index: number) => {
        const clickedObject = event.object;

        if (selectedIndex === index) {
            // deselect if the same object is clicked again
            setSelectedIndex(null); 

            selectedObject.current = null;
        } 

        // select the new object
        else {
            setSelectedIndex(index); 

            // store the mesh for TransformControls
            selectedObject.current = clickedObject; 
        }
    };

    const handleTransformStart = () => {
        setControlsEnabled(false); 
    };

    const handleTransformEnd = () => {
        setControlsEnabled(true); 
    };

    const handleTransformChange = () => {
        if (selectedIndex !== null && selectedObject.current) {
            const newPosition: [number, number, number] = [
                selectedObject.current.position.x,
                selectedObject.current.position.y,
                selectedObject.current.position.z,
            ];

            dispatch({
                type: "UPDATE_POLYHEDRON",  
                index: selectedIndex,     
                position: newPosition,    
            });
        }
    };

    // deselect all polyhedra when clicking outside
    const handlePointerMissed = () => {
        setSelectedIndex(null);
        selectedObject.current = null;
    };

    return (
        <Canvas style={{ height: "80vh", background: "#cccccc" }} onPointerMissed={handlePointerMissed} >
            <ambientLight intensity={0.5} />

            {statePolyhedra.map((polyhedron, index) => (
                <Polyhedron
                    key={index}
                    position={polyhedron.position}
                    geometry={polyhedron.geometry}
                    colour={polyhedron.colour}
                    onClick={(event) => handleObjectClick(event, index)} 
                    isSelected={selectedIndex === index}  
                />
            ))}

            {selectedObject.current && (
                <TransformControls
                    ref={transformControlRef}
                    object={selectedObject.current}

                    // disable OrbitControls when TransformControls interaction starts
                    onMouseDown={handleTransformStart} 
                    
                    // re-enable OrbitControls when TransformControls interaction ends
                    onMouseUp={handleTransformEnd}  
                    
                    // dispatch new position when object is transformed
                    onChange={handleTransformChange}  
                />
            )}

            <OrbitControls enabled={controlsEnabled} />
        </Canvas>
    );
};

export default Scene3D;