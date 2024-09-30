import { useContext, useEffect, useRef, useState } from 'react'
import * as THREE from "three";
import { IOUPolygonData, PolygonData } from '../utils/types'
import Infographic from './Infographic.tsx'
import { Backend2D } from '../backend/Interface.ts'
import { IOUPolygonContext } from '../contexts/IOUPolygonContext.tsx'
import { PolygonContext } from '../contexts/PolygonContext.tsx'

type PolygonProps = IOUPolygonData & { index: number };

// TODO: Make information on top of the polygon as a child instead?

const IOUPolygon = ({id, position, geometry, colour, opacity, parentIDa, parentIDb }: PolygonProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { polygons } = useContext(PolygonContext)!;
  const { dispatch, currentlyMousedOverPolygons, currentDecimalPlaces } = useContext(IOUPolygonContext)!;

  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);

  const calculateIoU = () => {
    console.log('parent polygons: ', parentIDa, parentIDb)
    const parentA = polygons.get(`${parentIDa}`);
    const parentB = polygons.get(`${parentIDb}`);
    if (parentA && parentB) {
      return Backend2D.IoU(parentA, parentB).area;
    }
    console.log('inside local IoU calculation, polygons: ', polygons);
    return -1;
  }

  useEffect(() => {
    if (mesh.current) {
      const box = new THREE.Box3().setFromObject(mesh.current);
      setBoundingBox(box);
    }
  }, [geometry, position]);

  return (
    <>
        <group>
          <mesh
            position={[position[0], position[1], 0]}
            geometry={geometry}
            ref={mesh}
            onPointerEnter={() => {
              if (dispatch)
                dispatch({ type: "ADD_MOUSED_OVER_POLYGON", id: id });
            }}
            onPointerLeave={() => {
              if (dispatch)
                dispatch({ type: "REMOVE_MOUSED_OVER_POLYGON", id: id });
            }}
          >
            <meshBasicMaterial
              color={colour}
              transparent={true}
              opacity={opacity}
            />
          </mesh>
          {/* renderVertices(geometry) */}
          {Math.max(...currentlyMousedOverPolygons) === id && (
            <Infographic
              position={!boundingBox ? new THREE.Vector3(position[0], position[1], 0) : boundingBox.getCenter(new THREE.Vector3).sub(boundingBox.getSize(new THREE.Vector3).multiplyScalar(0.5))
              } info={{"Area": Backend2D.area(geometry).toPrecision(currentDecimalPlaces+2),
              "Perimeter": Backend2D.perimeter(geometry).toPrecision(currentDecimalPlaces+2),
              "IoU": calculateIoU().toPrecision(currentDecimalPlaces+2)}} />
          ) }
        </group>
    </>
  );
};

export default IOUPolygon;
