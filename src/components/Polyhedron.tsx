import { useState, useRef, useMemo, useEffect, useContext } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei'; // Ensure Edges is correctly imported
import { ThreeEvent, useThree } from '@react-three/fiber';
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
    onClick: (event: ThreeEvent<MouseEvent>) => void;
    isSelected: boolean;
    onDoubleClick: () => void;
}

const Polyhedron = ({ 
    index, position, rotation, scale, geometry, colour, 
    onClick, onDoubleClick, isSelected
}: PolyhedronProps) => {
    const mesh = useRef<THREE.Mesh>(null);
    const { scene } = useThree();

    const context = useContext(PolyhedronContext);
    if (!context?.dispatch) {
        throw new Error("Scene3D must be used within a PolyhedronProvider");
    }
    const { dispatch } = context;

    const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);
    useEffect(() => {
        if (mesh.current) {
            const box = new THREE.Box3().setFromObject(mesh.current);
            setBoundingBox(box);
        }
    }, [geometry, position, scene]);

    const deleteSelectedPolygon = () => {
        document.body.style.cursor = "auto";
        if (dispatch) {
            dispatch({ type: "DELETE_POLYGON", index: index})
            // dispatch({ type: "SELECT_POLYGON", index: null });
        }
    }
    
    const duplicateSelectedPolygon = () => {
        if (dispatch) {
            dispatch({type: "DUPLICATE_POLYGON", index: index})
        }
    }
    
    const editSelectedPolygon = () => {
        console.log("lol")
    }

    const BoundingBox = useMemo(() => {
        if (!boundingBox || !isSelected) 
          return <></>;
    
        const size = boundingBox.getSize(new THREE.Vector3());
        const center = boundingBox.getCenter(new THREE.Vector3());
    
        return (
            <group> 
                {/* Red Lines to show bounding box: */}
                <box3Helper args={[boundingBox, "red"]}/>

                {/* Edit button */}
                <sprite
                    position={[center.x - 0.75, center.y + size.y/2 + 0.5, center.z]}
                    onClick={editSelectedPolygon}
                    scale={[0.5, 0.5, 0.5]}
                >
                    <spriteMaterial map={editIconTexture}/>
                </sprite>

                {/* Duplicate button */}
                <sprite
                    position={[center.x, center.y + size.y/2 + 0.5, center.z]}
                    onClick={() => {console.log("clicked!")}}
                    scale={[0.5, 0.5, 0.5]}
                >
                    <spriteMaterial map={duplicateIconTexture}/>
                </sprite>
                
                {/* Delete button */}
                <sprite
                    position={[center.x + 0.75, center.y + size.y/2 + 0.5, center.z]}
                    onClick={() => {console.log("clicked!")}}
                    scale={[0.5, 0.5, 0.5]}
                >
                    <spriteMaterial map={deleteIconTexture}/>
                </sprite>            
            </group>
        );
    }, [boundingBox, isSelected, scene]);

    return (
        <>
            <mesh
                ref={mesh}
                position={position}
                rotation={rotation}
                scale={scale}
                geometry={geometry}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
            >
                <meshBasicMaterial color={colour} />
                <Edges scale={1} color="white" />
            </mesh>
            {BoundingBox}
        </>
    );
};

export default Polyhedron;
