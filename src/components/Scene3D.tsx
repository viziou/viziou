import * as THREE from 'three';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { ArcballControls, TransformControls } from '@react-three/drei';
import { useRef, useContext, useEffect, useState } from 'react';
import Polyhedron from './Polyhedron';
import { PolyhedronContext } from '../contexts/PolyhedronContext';
import { Scene3DProps } from '../utils/types';

const Scene3D = ({ polyhedra, selectedIndex, setSelectedIndex }: Scene3DProps) => {
    const context = useContext(PolyhedronContext);

    if (!context?.dispatch) {
        throw new Error("Scene3D must be used within a PolyhedronProvider");
    }

    const { dispatch } = context;
    const transformControlRef = useRef(null);

    // ref for the TransformControls
    const selectedObject = useRef<THREE.Object3D | null>(null); 

    const [controlsEnabled, setControlsEnabled] = useState(true); 
    const [mode, setMode] = useState<"translate" | "rotate" | "scale">("translate");

    // deselect all polyhedra when clicking outside
    const handlePointerMissed = () => {
        setSelectedIndex(null);
        selectedObject.current = null; 
    };

    // toggle selection of polyhedron
    const handleObjectClick = (event: ThreeEvent<MouseEvent>, index: number) => {
        const clickedObject = event.object;

        if (selectedIndex === index) {
            setSelectedIndex(null);
            selectedObject.current = null;
        } else {
            setSelectedIndex(index);
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

            const newRotation: [number, number, number] = [
                selectedObject.current.rotation.x,
                selectedObject.current.rotation.y,
                selectedObject.current.rotation.z,
            ];

            const newScale: [number, number, number] = [
                selectedObject.current.scale.x,
                selectedObject.current.scale.y,
                selectedObject.current.scale.z,
            ];

            dispatch({
                type: "UPDATE_POLYHEDRON",
                index: selectedIndex,
                position: newPosition,
                rotation: newRotation,
                scale: newScale,
            });
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "w") {
                setMode("translate"); 
            } else if (event.key === "e") {
                setMode("rotate");    
            } else if (event.key === "r") {
                setMode("scale"); 
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <Canvas style={{ height: "100vh", background: "#cccccc" }} onPointerMissed={handlePointerMissed}>
            <ambientLight intensity={0.5} />

            {polyhedra.map((polyhedron, index) => (
                <Polyhedron
                    key={index}
                    index={index}
                    position={polyhedron.position}
                    rotation={polyhedron.rotation}
                    scale={polyhedron.scale}
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
                    mode={mode}
                    
                    // disable OrbitControls when TransformControls interaction starts
                    onMouseDown={handleTransformStart}

                    // re-enable OrbitControls when TransformControls interaction ends
                    onMouseUp={handleTransformEnd}

                    // dispatch new position when object is transformed
                    onChange={handleTransformChange}
                />
            )}

            <ArcballControls
                target={selectedIndex !== null ? polyhedra[selectedIndex].position : [0, 0, 0]}
                enableZoom={true}
                enablePan={true}
                enabled={controlsEnabled}
            />

        </Canvas>
    );
};

export default Scene3D;