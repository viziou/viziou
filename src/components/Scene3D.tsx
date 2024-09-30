import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useContext } from 'react';
import Polyhedron from './Polyhedron';
import { PolyhedronContext } from '../contexts/PolyhedronContext';
import { Scene3DProps } from '../utils/types';

const Scene3D = ({ polyhedra }: Scene3DProps) => {
    const context = useContext(PolyhedronContext);
    if (!context?.dispatch) {
        throw new Error("Scene3D must be used within a PolyhedronProvider");
    }
    const { dispatch } = context;
    
    // Deselect polyhedra when clicking outside
    const handlePointerMissed = (): void => {
        if (dispatch) {
            dispatch({ type: "SELECT_POLYHEDRON", index: null });
      }
    };

    return (
        <Canvas style={{ height: "100vh", width: "100vw", background: "#cccccc" }} onPointerMissed={handlePointerMissed}>
            <ambientLight intensity={0.5} />

            {polyhedra.map((polyhedron, index) => (
                <Polyhedron
                    key={index}
                    index={index}
                    position={polyhedron.position}
                    rotation={polyhedron.rotation}
                    scale={polyhedron.scale}
                    geometry={polyhedron.geometry}
                    colour={polyhedron.colour}
                />
            ))}

            <OrbitControls
                makeDefault
                enableZoom={true}
                enablePan={true}
                enableDamping={true}
            />
        </Canvas>
    );
};

export default Scene3D;