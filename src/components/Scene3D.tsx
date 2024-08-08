import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Scene3DProps } from '../utils/types';
import Polyhedron from './Polyhedron';

const Scene3D = ({ polyhedra }: Scene3DProps) => {
    return (
        <Canvas style={{ height: "80vh", background: "#cccccc" }}>

            <ambientLight intensity={0.5} />

            {polyhedra.map((polyhedra, index) => (
                <Polyhedron key={index} position={polyhedra.position} geometry={polyhedra.geometry} colour={polyhedra.colour} />
            ))}
      
            <OrbitControls/>
        
        </Canvas>
    );
};

export default Scene3D;