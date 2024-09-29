import { useRef } from "react";
import * as THREE from "three";
import { PolygonData } from "../utils/types";

type PolygonProps = PolygonData & { index: number };

// TODO: Make information on top of the polygon as a child instead?

const IOUPolygon = ({ position, geometry, colour, opacity }: PolygonProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  //const { dispatch } = useContext(IOUPolygonContext)!;

  // const renderPoint = ({x, y}: {x: number, y: number}, size = 0.03, smoothness = 50) => {
  //   return (
  //     <mesh
  //       position={[x, y, 0]}
  //       geometry={new THREE.CircleGeometry(size, smoothness)}
  //     >
  //       <meshStandardMaterial color={'#000000'} />
  //     </mesh>);
  // }

  // const renderVertices = (geometry: THREE.BufferGeometry) => {
  //   /* Dynamically generate the vertices of a polygon. */
  //   const pos = geometry.getAttribute('position')
  //   const idx: {x: number, y: number, z:number}[] = [];
  //   for (let i = 0; i < pos.count; i += 3) {
  //     idx.push({x: pos.array[i], y: pos.array[i+1], z: pos.array[i+2]});
  //   }
  //
  //   return (
  //     <>
  //       {idx.map((args) => {
  //         return renderPoint(args)
  //       })}
  //   </>
  //   )
  // }

  return (
    <>
        <group>
          <mesh
            position={[position[0], position[1], 0]}
            geometry={geometry}
            ref={mesh}
          >
            <meshBasicMaterial
              color={colour}
              transparent={true}
              opacity={opacity}
            />
          </mesh>
          {/* renderVertices(geometry) */}
        </group>
    </>
  );
};

export default IOUPolygon;
