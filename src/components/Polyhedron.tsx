import { useRef, useEffect, useContext } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei'; // Ensure Edges is correctly imported
import { ThreeEvent, useThree, useFrame } from '@react-three/fiber';
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
    onPointerOver?: () => void;
    onPointerOut?: () => void;
    onDoubleClick?: () => void;
}

const Polyhedron = ({ index, position, rotation, scale, geometry, colour, onClick, onDoubleClick, isSelected, onPointerOver, onPointerOut }: PolyhedronProps) => {
    const mesh = useRef<THREE.Mesh>(null);
    const boundingBoxRef = useRef<THREE.BoxHelper | null>(null);
    const spriteRef = useRef<THREE.Sprite | null>(null);
    const { scene } = useThree();

    const context = useContext(PolyhedronContext);

    if (!context?.dispatch) {
        throw new Error("Scene3D must be used within a PolyhedronProvider");
    }    
    
    const { dispatch } = context;

    useEffect(() => {
        if (mesh.current) {

            const transformedVertices: THREE.Vector3[] = [];
            const positionAttribute = mesh.current.geometry.getAttribute("position");

            // iterate over each vertex in the geometry and apply the transformation matrix
            for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3();

                // get the vertex in local space
                vertex.fromBufferAttribute(positionAttribute, i);

                 // apply world transformation (position, rotation, scale)
                vertex.applyMatrix4(mesh.current.matrixWorld);    
                transformedVertices.push(vertex);
            }

            dispatch({
                type: "STORE_TRANSFORMED_VERTICES",
                index: index,
                transformedVertices: transformedVertices,
            });


            if (isSelected) {
                if (!boundingBoxRef.current) {
                    boundingBoxRef.current = new THREE.BoxHelper(mesh.current, 0xffff00);
                    const box = new THREE.Box3().setFromObject(mesh.current);
                    console.log(box.getSize(new THREE.Vector3()));
                    scene.add(boundingBoxRef.current); 

                    const material = new THREE.SpriteMaterial( { map: editIconTexture } );
                    spriteRef.current = new THREE.Sprite( material );
                    // spriteRef.current.scale.set(5, 5, 1)
                    spriteRef.current.position.set(6, 6, 6)
                    scene.add(spriteRef.current);
                }
                
            } else {
                if (boundingBoxRef.current) {
                    scene.remove(boundingBoxRef.current);
                    boundingBoxRef.current = null;
                }
                if (spriteRef.current) {
                    scene.remove(spriteRef.current);
                    spriteRef.current = null;
                }
            }
        }

        return () => {
            if (boundingBoxRef.current) {
                scene.remove(boundingBoxRef.current);
            }
        };
    }, [isSelected, scene]);

    useFrame(() => {
        if (boundingBoxRef.current) {
            boundingBoxRef.current.update();
        }
    });

    return (
        <mesh
            ref={mesh}
            position={position}
            rotation={rotation}
            scale={scale}
            geometry={geometry}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
        >
        <meshStandardMaterial color={colour} />
        <Edges geometry={geometry} scale={1} color="white" />
        </mesh>
    );
};

export default Polyhedron;
