import { Canvas } from '@react-three/fiber';
import { Scene2DProps } from '../utils/types';
import Polygon from './Polygon';

const Scene2D = ({ polygons }: Scene2DProps) => {
    return (
        <Canvas style={{ height: "80vh", background: "#cccccc" }}>

            {polygons.map((polygon, index) => (
                <Polygon key={index} position={polygon.position} geometry={polygon.geometry} colour={polygon.colour} />
            ))}
      
        </Canvas>
    );
};

export default Scene2D;
