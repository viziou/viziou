import { useRef, useEffect, useContext } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei'; // Ensure Edges is correctly imported
import { ThreeEvent, useThree, useFrame } from '@react-three/fiber';
import { PolyhedronData } from '../utils/types';
import { PolyhedronContext } from '../contexts/PolyhedronContext';

interface PolyhedronProps extends PolyhedronData {
    id: number;
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

const Polyhedron = ({ id, position, rotation, scale, geometry, colour, onClick, isSelected, onPointerOver, onPointerOut }: PolyhedronProps) => {
    const mesh = useRef<THREE.Mesh>(null);
    const boundingBoxRef = useRef<THREE.BoxHelper | null>(null);
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
                id: id,
                transformedVertices: transformedVertices,
            });

            console.log("Transformed vertices:", transformedVertices);


            if (isSelected) {
                if (!boundingBoxRef.current) {
                    boundingBoxRef.current = new THREE.BoxHelper(mesh.current, 0xffff00);
                    scene.add(boundingBoxRef.current);
                }
            } else {
                if (boundingBoxRef.current) {
                    scene.remove(boundingBoxRef.current);
                    boundingBoxRef.current = null;
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
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
        >
            <meshStandardMaterial color={colour} />
            <Edges geometry={geometry} scale={1} color="white" />
        </mesh>
    );
};

export default Polyhedron;
