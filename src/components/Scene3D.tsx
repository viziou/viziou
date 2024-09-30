import * as THREE from 'three';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { ArcballControls, TransformControls } from '@react-three/drei';
import { useRef, useContext, useState } from 'react';

import Polyhedron from './Polyhedron';
import { PolyhedronContext } from '../contexts/PolyhedronContext';
import { Scene3DProps } from '../utils/types';
import IOUPolyhedron from './IOUPolyhedron.tsx'

const Scene3D = ({ polyhedra, selectedId, setSelectedId, iouPolyhedrons, /*iouDispatch*/ }: Scene3DProps) => {
    const context = useContext(PolyhedronContext);

    if (!context?.dispatch) {
        throw new Error("Scene3D must be used within a PolyhedronProvider");
    }

    const { dispatch } = context;
    const transformControlRef = useRef(null);

    const selectedObject = useRef<THREE.Object3D | null>(null);

    const [controlsEnabled, setControlsEnabled] = useState(true);
    const [mode, setMode] = useState<"translate" | "rotate" | "scale">("translate");
    const [lastClickTime, setLastClickTime] = useState<number>(0);

    // deselect all polyhedra when clicking outside
    const handlePointerMissed = (): void => {
        setSelectedId(null);
        selectedObject.current = null;
    };

    // toggle selection of polyhedron (single vs double-click)
    const handleObjectClick = (event: ThreeEvent<MouseEvent>, id: number): void => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClickTime;

        if (timeDiff < 250) {
            handleDoubleClick();
        }

        else {
            const clickedObject = event.object as THREE.Object3D;

            if (selectedId === id) {
                setSelectedId(null);
                selectedObject.current = null;
            } else {
                setSelectedId(id);
                selectedObject.current = clickedObject;
            }
        }

        setLastClickTime(currentTime);
    };

    const handleTransformStart = (): void => {
        setControlsEnabled(false);
    };

    const handleTransformEnd = (): void => {
        setControlsEnabled(true);
    };

    const handleTransformChange = (): void => {
        if (selectedId !== null && selectedObject.current) {
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
                id: selectedId,
                position: newPosition,
                rotation: newRotation,
                scale: newScale,
            });
        }
    };

    const handleDoubleClick = (): void => {
        if (mode === "translate") {
            setMode("rotate");
        }

        else if (mode === "rotate") {
            setMode("scale");
        }

        else if (mode === "scale") {
            setMode("translate");
        }
    };

    return (
        <Canvas style={{ height: "100vh", background: "#cccccc" }} onPointerMissed={handlePointerMissed}>
            <ambientLight intensity={0.5} />

            {Array.from(polyhedra.values()).map((polyhedron, index) => (
                <Polyhedron
                    id={polyhedron.id}
                    key={index}
                    position={polyhedron.position}
                    rotation={polyhedron.rotation}
                    scale={polyhedron.scale}
                    geometry={polyhedron.geometry}
                    colour={polyhedron.colour}
                    onClick={(event) => handleObjectClick(event, polyhedron.id)}
                    isSelected={selectedId === polyhedron.id}
                    opacity={polyhedron.opacity}
                />
            ))}

          {Array.from(iouPolyhedrons.values()).map((polyhedron, index) => (
            <IOUPolyhedron
              id={polyhedron.id}
              key={index}
              position={polyhedron.position}
              rotation={polyhedron.rotation}
              scale={polyhedron.scale}
              geometry={polyhedron.geometry}
              colour={polyhedron.colour}
              opacity={polyhedron.opacity}
              parentIDa={polyhedron.parentIDa}
              parentIDb={polyhedron.parentIDb}
            />
          ))}

            {selectedObject.current && (
                <TransformControls
                    ref={transformControlRef}
                    object={selectedObject.current}
                    mode={mode}
                    onMouseDown={handleTransformStart}
                    onMouseUp={handleTransformEnd}
                    onChange={handleTransformChange}
                />
            )}

            <ArcballControls
                enableZoom={true}
                enablePan={true}
                enabled={controlsEnabled}
            />
        </Canvas>
    );
};

export default Scene3D;
