import { Canvas } from '@react-three/fiber';
import Polygon from './Polygon';
import { Scene2DProps } from '../utils/types';

const Scene2D = ({ polygons }: Scene2DProps) => {
  return (
    <Canvas style={{ height: '80vh', background: '#cccccc' }}>

      {polygons.map((polygon, index) => (
        <Polygon key={index} position={polygon.position} geometry={polygon.geometry} colour={polygon.colour} />
      ))}
      
    </Canvas>
  );
};

export default Scene2D;
