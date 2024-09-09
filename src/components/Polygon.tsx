import { useContext, useRef } from "react";
import * as THREE from "three";
import { PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import { DragControls } from "@react-three/drei";
import { CircleGeometry } from 'three'
import { i } from 'mathjs'

type PolygonProps = PolygonData & { index: number };

// TODO: Make information on top of the polygon as a child instead?

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

  const renderPoint = ({x, y}: {x: number, y: number}, size = 0.03, smoothness = 50) => {
    return (
      <mesh
        position={[x, y, 0]}
        geometry={new THREE.CircleGeometry(size, smoothness)}
      >
        <meshStandardMaterial color={'#000000'} />
      </mesh>);
  }

  const renderVertices = (geometry: THREE.BufferGeometry) => {
    /* Dynamically generate the vertices of a polygon. */
    const pos = geometry.getAttribute('position')
    const idx: {x: number, y: number, z:number}[] = [];
    for (let i = 0; i < pos.count; i += 3) {
      idx.push({x: pos.array[i], y: pos.array[i+1], z: pos.array[i+2]});
    }

    return (
      <>
        {idx.map((args) => {
          return renderPoint(args)
        })}
    </>
    )
  }

  return (
    <>
      <DragControls
        matrix={matrix}
        autoTransform={false}
        onDragStart={handleDragStart}
        onDrag={(localMatrix) => {handleDrag(localMatrix)}}
        onDragEnd={handleDragEnd}
      >
        <group>
          <mesh
            position={[position[0], position[1], 0]}
            geometry={geometry}
            ref={mesh}
          >
            <meshBasicMaterial color={colour} />
          </mesh>
          {renderVertices(geometry)}
        </group>
      </DragControls>
    </>
  );
};

export default Polygon;
