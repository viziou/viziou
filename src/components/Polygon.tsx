import { useContext, useRef } from "react";
import * as THREE from "three";
import { PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import { useThree, extend, Node, Props, MaterialNode, BufferGeometryNode, Object3DNode } from '@react-three/fiber'
import { useGesture } from 'react-use-gesture';
//import { DragControls } from '@react-three/fiber/native'
import { DragControls as DG2} from 'three/examples/jsm/controls/DragControls';
import { DragControls } from "@react-three/drei";
import { add } from 'three/src/nodes/math/OperatorNode'
//import { DragControls } from 'three/addons/controls/DragControls.js';

class CustomDragControls extends DG2 {}

extend({ CustomDragControls });

declare module '@react-three/fiber' {
  interface ThreeElements {
    customDragControls: Object3DNode<CustomDragControls, typeof CustomDragControls>;
  }
}

type PolygonProps = PolygonData & { index: number };

const Polygon = ({ position, geometry, colour, index }: PolygonProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { dispatch } = useContext(PolygonContext)!;
  const { camera, gl } = useThree();
  const controlsRef = useRef(null);
  //const originalPosition = useRef<[number, number]>(null);
  const originalPosition = useRef<[number, number]>([0, 0]);

  const matrix = new THREE.Matrix4();

  const handleDragEnd = () => {
    //matrix.identity(); // reset the matrix
    return;
    if (mesh.current) {
      const v = new THREE.Vector3();
      mesh.current.getWorldPosition(v);
      const old_position = v.toArray().slice(0, 2) as [number, number];
      const position = mesh.current.position.toArray().slice(0,2) as [number, number]
      console.log("original attempt position: ", old_position);
      console.log("new attempt position: ", position)
      console.log("local matrix before dispatched: ", matrix);
      if (dispatch) {
        dispatch({
          type: "UPDATE_POSITION",
          index: index,
          position: old_position,
          //localMatrix: matrix
        });
        //matrix.identity(); // reset matrix
      }

      console.log("local matrix after dispatched: ", matrix);
    }
  };
  const handleDragStart = () => {
    if (mesh.current) {
      const v = new THREE.Vector3();
      mesh.current.getWorldPosition(v)
      originalPosition.current = v.toArray().slice(0,2) as [number, number];
      //console.log('original_position: ', originalPosition);
    }
  }

  const handleDrag = (localMatrix: THREE.Matrix4) => {
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
  }
    //
    // const handleDrag = () => {
    //   if (mesh.current) {
    //     /* */
    //   }
    // }
    //
    //
    //
    // const bind = useGesture({
    //   onDrag: ({ offset: [x, y] }) => set({position: [x, y]}),
    // })

  return (
    <>
      <DragControls
        //ref={controlsRef}
        //args={[[mesh.current], camera, gl.domElement]}
        //transformGroup={true}
        matrix={matrix}
        autoTransform={false}
        //onDrag={(worldMatrix) => matrix.copy(worldMatrix)}
        // onDrag={(localMatrix, deltaLocalMatrix) => {
        //   console.log('localMatrix', localMatrix);
        //   console.log('deltaLocalMatrix', deltaLocalMatrix);
        // }}
        //onDragEnd={handleDragEnd}
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
