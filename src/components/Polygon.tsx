import { useContext, useRef } from "react";
import * as THREE from "three";
import { PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import { useThree } from "@react-three/fiber";
import { DragControls } from "@react-three/drei";

type PolygonProps = PolygonData & { index: number };

const Polygon = ({ position, geometry, colour, index }: PolygonProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { dispatch } = useContext(PolygonContext)!;
  const { camera, gl } = useThree();
  const controlsRef = useRef<THREE.DragControls>(null);

  const handleDragEnd = () => {
    if (mesh.current) {
      const v = new THREE.Vector3();
      mesh.current.getWorldPosition(v);
      const position = v.toArray().slice(0, 2) as [number, number];
      if (dispatch)
        dispatch({
          type: "UPDATE_POSITION",
          index: index,
          position: position,
        });
    }
  };

  return (
    <>
      <DragControls
        ref={controlsRef}
        args={[[mesh.current], camera, gl.domElement]}
        transformGroup={true}
        onDragEnd={handleDragEnd}
      >
        <mesh
          position={[position[0], position[1], 0]}
          geometry={geometry}
          ref={mesh}
        >
          <meshBasicMaterial color={colour} />
        </mesh>
      </DragControls>
    </>
  );
};

export default Polygon;
