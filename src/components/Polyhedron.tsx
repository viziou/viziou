import { useRef } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';
import { PolyhedronData } from '../utils/types';

const Polyhedron = ({ position, geometry, colour }: PolyhedronData) => {
    const mesh = useRef<THREE.Mesh>(null);

    return (
        <mesh position={position} geometry={geometry} ref={mesh}>
            <meshStandardMaterial color={colour} />
            <Edges geometry={geometry} scale={1} color="white" />
        </mesh>
    );
};

export default Polyhedron;
