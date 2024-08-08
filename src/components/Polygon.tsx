import { useRef } from 'react';
import * as THREE from 'three';
import { PolygonData } from '../utils/types';

const Polygon = ({ position, geometry, colour }: PolygonData) => {
    const mesh = useRef<THREE.Mesh>(null);

    return (
        <mesh position={[position[0], position[1], 0]} geometry={geometry} ref={mesh}>
            <meshBasicMaterial color={colour} />
        </mesh>
    );
};

export default Polygon;
