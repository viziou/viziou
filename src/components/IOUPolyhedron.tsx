import { useRef, useContext } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei'; // Ensure Edges is correctly imported
//import { ThreeEvent, useThree } from '@react-three/fiber';
import { IOUPolyhedronData } from '../utils/types'
import { PolyhedronContext } from '../contexts/PolyhedronContext';

interface IOUPolyhedronProps extends IOUPolyhedronData {
    id: number;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    geometry: THREE.BufferGeometry;
    colour: string;
    // onClick: (event: ThreeEvent<MouseEvent>) => void;
    // isSelected: boolean;
    // onPointerOver?: () => void;
    // onPointerOut?: () => void;
    // onDoubleClick?: () => void;
}

const IOUPolyhedron = ({ position, rotation, scale, geometry, colour, opacity /* id, parentIDa, parentIDb */ }: IOUPolyhedronProps) => {
    const mesh = useRef<THREE.Mesh>(null);
    //const boundingBoxRef = useRef<THREE.BoxHelper | null>(null);

    const context = useContext(PolyhedronContext);

    if (!context?.dispatch) {
        throw new Error("Scene3D must be used within a PolyhedronProvider");
    }

    console.log('opacity: ', opacity)

    return (
        <mesh
            ref={mesh}
            position={position}
            rotation={rotation}
            scale={scale}
            geometry={geometry}
        >
            <meshStandardMaterial
              color={colour}
              transparent={true}
              opacity={opacity}
            />
            <Edges geometry={geometry} scale={1} color="white" />
        </mesh>
    );
};

export default IOUPolyhedron;
