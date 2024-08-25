import { useContext, useRef } from "react";
import * as THREE from "three";
import { PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import { DragControls } from "@react-three/drei";

type PolygonProps = PolygonData & { index: number };

const Polygon = ({ position, geometry, colour, index }: PolygonProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { dispatch } = useContext(PolygonContext)!;
  const originalPosition = useRef<[number, number]>([0, 0]);

  const matrix = new THREE.Matrix4();

  const handleDragEnd = () => {
    /* Could trigger updates to IoU or something here maybe */
  };

  const handleDragStart = () => {
    if (mesh.current) {
      const v = new THREE.Vector3();
      mesh.current.getWorldPosition(v)
      originalPosition.current = v.toArray().slice(0,2) as [number, number];
      //console.log('original_position: ', originalPosition);
    }
  };

  const handleDrag = (localMatrix: THREE.Matrix4) => {
    // TODO: research if there's a faster way to decompose
    if (mesh.current) {
      const new_v = new THREE.Vector3();
      localMatrix.decompose(new_v, new THREE.Quaternion(), new THREE.Vector3)
      const new_pos = new_v.toArray().slice(0,2) as [number, number]
      //console.log('original position (inside handleDrag): ', originalPosition);
      new_pos[0] += originalPosition.current[0];
      new_pos[1] += originalPosition.current[1]; // TODO: this is ugly
      if (dispatch) {
        dispatch({
          type: "UPDATE_POSITION",
          index: index,
          position: new_pos,
        })
      }
    }
  };

  return (
    <>
      <DragControls
        matrix={matrix}
        autoTransform={false}
        onDragStart={handleDragStart}
        onDrag={(localMatrix) => {handleDrag(localMatrix)}}
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
