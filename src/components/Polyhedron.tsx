import { useState, useRef, useMemo, useEffect, useContext } from 'react';
import * as THREE from 'three';
import { Edges, TransformControls } from '@react-three/drei'; // Ensure Edges is correctly imported
import { useThree } from '@react-three/fiber';
import { PolyhedronData } from '../utils/types';
import { PolyhedronContext } from '../contexts/PolyhedronContext';

// Load texture icons
const editIconTexture = new THREE.TextureLoader().load("src/assets/new_edit.png")
const deleteIconTexture = new THREE.TextureLoader().load("src/assets/new_bin.png")
const duplicateIconTexture = new THREE.TextureLoader().load("src/assets/new_duplicate.png")

interface PolyhedronProps extends PolyhedronData {
    index: number;
    position: [number, number, number];
    rotation: [number, number, number];  
    scale: [number, number, number];  
    geometry: THREE.BufferGeometry;
    colour: string;
}

const Polyhedron = ({ 
    index, position, rotation, scale, geometry, colour, 
}: PolyhedronProps) => {
    const mesh = useRef<THREE.Mesh>(null);
    const { scene } = useThree();

    const context = useContext(PolyhedronContext);
    if (!context?.dispatch) {
        throw new Error("Scene3D must be used within a PolyhedronProvider");
    }
    const { selectedPolyhedronID, dispatch } = context;

    const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);
    const [mode, setMode] = useState<"translate" | "rotate" | "scale">("translate");
    const [mousePointer, setMousePointer] = useState<string | null>(null);

    const selectPolyhedra = () => {
        if (dispatch) {
            dispatch({ type: "SELECT_POLYHEDRON", index: index });
        }
    };
    
    const isPolyhedronSelected = () => {
        return selectedPolyhedronID === index;
    };

    const changeTransformMode = (): void => {
        if (mode === "translate") {
            setMode("rotate");
        } else if (mode === "rotate") {
            setMode("scale");
        } else if (mode === "scale") {
            setMode("translate");
        }
    };

    useEffect(() => {
        if (mesh.current) {
            const box = new THREE.Box3().setFromObject(mesh.current);
            setBoundingBox(box);
        }
    }, [geometry, position, scene]);

    useEffect(() => {
        document.body.style.cursor =
            mousePointer === "pointer"
            ? "pointer"
            : "auto";
      }, [mousePointer]);

    const deleteSelectedPolyhedron = () => {
        document.body.style.cursor = "auto";
        if (dispatch) {
            dispatch({ type: "DELETE_POLYHEDRON", index: index});
        }
    }
    
    const duplicateSelectedPolyhedron = () => {
        if (dispatch) {
            dispatch({type: "DUPLICATE_POLYHEDRON", index: index})
        }
    }
    
    const editSelectedPolyhedron = () => {
        console.log("lol")
    }

    const handleTransformChange = (): void => {
        if (mesh.current) {
            const newPosition: [number, number, number] = [
                mesh.current.position.x,
                mesh.current.position.y,
                mesh.current.position.z,
            ];

            const newRotation: [number, number, number] = [
                mesh.current.rotation.x,
                mesh.current.rotation.y,
                mesh.current.rotation.z,
            ];

            const newScale: [number, number, number] = [
                mesh.current.scale.x,
                mesh.current.scale.y,
                mesh.current.scale.z,
            ];

            dispatch({
                type: "UPDATE_POLYHEDRON",
                index: index,
                position: newPosition,
                rotation: newRotation,
                scale: newScale,
            });
        }
    };

    const BoundingBox = useMemo(() => {
        if (!boundingBox || !isPolyhedronSelected()) {
            return <></>;
        }
    
        const size = boundingBox.getSize(new THREE.Vector3());
        const center = boundingBox.getCenter(new THREE.Vector3());
        return (
            <group>
                <TransformControls 
                    object={mesh.current as THREE.Mesh} 
                    position={position}
                    onObjectChange={handleTransformChange}
                    mode={mode}
                />

                {/* Red Lines to show bounding box: */}
                <box3Helper args={[boundingBox, "red"]}/>

                {/* Edit button */}
                <sprite
                    position={[center.x - 0.75, center.y + size.y/2 + 0.5, center.z]}
                    onClick={(event) => {
                        event.stopPropagation();
                        editSelectedPolyhedron();
                    }}
                    onPointerEnter={() => setMousePointer("pointer")}
                    onPointerLeave={() => setMousePointer(null)}
                    scale={[0.5, 0.5, 0.5]}
                >
                    <spriteMaterial map={editIconTexture}/>
                </sprite>

                {/* Duplicate button */}
                <sprite
                    position={[center.x, center.y + size.y/2 + 0.5, center.z]}
                    onClick={(event) => {
                        event.stopPropagation();
                        duplicateSelectedPolyhedron();
                    }}
                    onPointerEnter={() => setMousePointer("pointer")}
                    onPointerLeave={() => setMousePointer(null)}
                    scale={[0.5, 0.5, 0.5]}
                >
                    <spriteMaterial map={duplicateIconTexture}/>
                </sprite>
                
                {/* Delete button */}
                <sprite
                    position={[center.x + 0.75, center.y + size.y/2 + 0.5, center.z]}
                    onClick={(event) => {
                        event.stopPropagation();
                        deleteSelectedPolyhedron();
                    }}
                    onPointerEnter={() => setMousePointer("pointer")}
                    onPointerLeave={() => setMousePointer(null)}
                    scale={[0.5, 0.5, 0.5]}
                >
                    <spriteMaterial map={deleteIconTexture}/>
                </sprite>            
            </group>
        );
    }, [boundingBox, selectedPolyhedronID, scene, mode]);

    return (
        <>
            <mesh
                ref={mesh}
                position={position}
                rotation={rotation}
                scale={scale}
                geometry={geometry}
                onClick={(event) => {
                    event.stopPropagation();
                    selectPolyhedra();
                }}
                onDoubleClick={changeTransformMode}
            >
                <meshBasicMaterial color={colour} />
                <Edges scale={1} color="white" />
            </mesh>
            {BoundingBox}
        </>
    );
};

export default Polyhedron;
