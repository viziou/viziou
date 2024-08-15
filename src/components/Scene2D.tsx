import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Scene2DProps } from '../utils/types';
import Polygon from './Polygon';
import * as THREE from 'three'

const Scene2D = ({ polygons }: Scene2DProps) => {
    return (
        <Canvas style={{ height: "80vh", background: "#cccccc" }} >

            {polygons.map((polygon, index) => (
                <Polygon key={index} index={index} position={polygon.position} geometry={polygon.geometry} colour={polygon.colour} />
            ))}
      
            <OrbitControls
                enableRotate={false} 
                enablePan={true}
                enableZoom={true} 
                enableDamping={false}
                mouseButtons={{
                  LEFT: THREE.MOUSE.PAN
                }}
            />

        </Canvas>
    );
};

export default Scene2D;
