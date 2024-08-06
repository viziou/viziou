import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// temp imports (using 2D currently)
import { Scene2DProps } from '../utils/types';
import Polygon from './Polygon';


const Scene3D = ({ polygons }: Scene2DProps) => {
  return (
    <Canvas style={{ height: '80vh', background: '#cccccc' }}>

        {polygons.map((polygon, index) => (
            <Polygon key={index} position={polygon.position} geometry={polygon.geometry} colour={polygon.colour} />
        ))}
      
        <OrbitControls/>
        
    </Canvas>
  );
};

export default Scene3D;