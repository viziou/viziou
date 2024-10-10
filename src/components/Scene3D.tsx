import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useContext } from 'react';
import Polyhedron from './Polyhedron';
import { PolyhedronContext } from '../contexts/PolyhedronContext';
import { Scene3DProps } from '../utils/types';
import IOUPolyhedron from './IOUPolyhedron.tsx'

const Scene3D = ({ polyhedra, iouPolyhedrons, /* selectedId, setSelectedId,iouDispatch*/ }: Scene3DProps) => {
    const context = useContext(PolyhedronContext);
    if (!context?.dispatch) {
        throw new Error("Scene3D must be used within a PolyhedronProvider");
    }
    const { dispatch } = context;

    // Deselect polyhedra when clicking outside
    const handlePointerMissed = (): void => {
        if (dispatch) {
            dispatch({ type: "SELECT_POLYHEDRON", id: null });
        }
    };

    return (
        <Canvas style={{ height: "100vh", width: "100vw", background: "#cccccc" }} onPointerMissed={handlePointerMissed}>
            <ambientLight intensity={0.5} />

            {Array.from(polyhedra.values()).map((polyhedron, index) => (
                <Polyhedron
                    id={polyhedron.id}
                    key={index}
                    position={polyhedron.position}
                    rotation={polyhedron.rotation}
                    scale={polyhedron.scale}
                    geometry={polyhedron.geometry}
                    colour={polyhedron.colour}
                    opacity={polyhedron.opacity}
                />
            ))}

          {Array.from(iouPolyhedrons.values()).map((polyhedron, index) => (
            <IOUPolyhedron
              id={polyhedron.id}
              key={index}
              position={polyhedron.position}
              rotation={polyhedron.rotation}
              scale={polyhedron.scale}
              geometry={polyhedron.geometry}
              colour={polyhedron.colour}
              opacity={polyhedron.opacity}
              parentIDa={polyhedron.parentIDa}
              parentIDb={polyhedron.parentIDb}
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
