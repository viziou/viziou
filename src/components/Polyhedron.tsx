import { useRef } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';

import { PolyhedronData } from '../utils/types';

interface PolyhedronProps extends PolyhedronData {
    onClick?: (e: ThreeEvent<MouseEvent>) => void;
    isSelected?: boolean;
    onPointerOver?: () => void;
    onPointerOut?: () => void;
}

const Polyhedron = ({ position, geometry, colour, onClick, isSelected, onPointerOver, onPointerOut }: PolyhedronProps) => {
    const mesh = useRef<THREE.Mesh>(null);

    return (
        <mesh position={position} geometry={geometry} ref={mesh} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut} >
            <meshStandardMaterial color={colour} />
            <Edges geometry={geometry} scale={1} color="white" />

            {isSelected && <Edges geometry={geometry} lineWidth={5} color="red" />}
        </mesh>
    );
};

export default Polyhedron;