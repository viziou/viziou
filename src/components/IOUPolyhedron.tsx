import { useRef, useContext, useEffect, useState } from 'react'
import * as THREE from 'three';
import { Edges } from '@react-three/drei'; // Ensure Edges is correctly imported
//import { ThreeEvent, useThree } from '@react-three/fiber';
import { IOUPolyhedronData } from '../utils/types'
import { EulerOrder } from 'three'
import { IOUPolyhedronContext } from '../contexts/IOUPolyhedronContext.tsx'
import Infographic from './Infographic.tsx'
import { Backend3D } from '../backend/Interface.ts'
import { PolyhedronContext } from '../contexts/PolyhedronContext.tsx'
import { useThree } from '@react-three/fiber'

interface IOUPolyhedronProps extends IOUPolyhedronData {
    id: number;
    position: [number, number, number];
    rotation: [number, number, number, EulerOrder];
    scale: [number, number, number];
    geometry: THREE.BufferGeometry;
    colour: string;
    // onClick: (event: ThreeEvent<MouseEvent>) => void;
    // isSelected: boolean;
    onPointerOver?: () => void;
    onPointerOut?: () => void;
    // onDoubleClick?: () => void;
}

const IOUPolyhedron = ({id, position, rotation, scale, geometry, colour, opacity, parentIDa, parentIDb}: IOUPolyhedronProps) => {
    const mesh = useRef<THREE.Mesh>(null);
    //const boundingBoxRef = useRef<THREE.BoxHelper | null>(null);

    const { scene } = useThree();
    const { polyhedra } = useContext(PolyhedronContext)!;
    const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);
    const {dispatch, currentlyMousedOverPolyhedrons, currentDecimalPlaces} = useContext(IOUPolyhedronContext)!;

    if (!dispatch) {
      throw new Error("Scene3D must be used within a PolyhedronProvider");
    }

    const calculateIoU = () => {
      console.log('parent polygons: ', parentIDa, parentIDb)
      const parentA = polyhedra.get(`${parentIDa}`);
      const parentB = polyhedra.get(`${parentIDb}`);
      if (parentA && parentB) {
        return Backend3D.IoU(parentA, parentB).area;
      }
      console.log('inside local IoU calculation, polygons: ', polyhedra);
      return -1;
    }

    useEffect(() => {
      if (mesh.current) {
        const box = new THREE.Box3().setFromObject(mesh.current);
        setBoundingBox(box);
      }
    }, [geometry, position, scene]);

    return (
        <mesh
            ref={mesh}
            position={position}
            rotation={rotation}
            scale={scale}
            geometry={geometry}
            onPointerEnter={() => {
              console.log('entered iou polyhedron ', id);
              if (dispatch)
                dispatch({ type: "ADD_MOUSED_OVER_POLYHEDRON", id: id });
              console.log('currently mousing over ', currentlyMousedOverPolyhedrons.length, ' iou polyhedra');
            }}
            onPointerLeave={() => {
              console.log('exited iou polyhedron ', id);
              if (dispatch)
                dispatch({ type: "REMOVE_MOUSED_OVER_POLYHEDRON", id: id });
            }}
            renderOrder={999} // this forces the IoU polygon to always render over the top
        >
            <meshStandardMaterial
              color={colour}
              transparent={true}
              opacity={opacity}
              depthTest={false}
            />
            <Edges geometry={geometry} scale={1} color="white" renderOrder={9999} depthTest={false} transparent={true} />
          {Math.max(...currentlyMousedOverPolyhedrons) === id && (
            <Infographic
              position={!boundingBox ? new THREE.Vector3(position[0], position[1], position[2]) : boundingBox.getCenter(new THREE.Vector3).sub(boundingBox.getSize(new THREE.Vector3).multiplyScalar(0.5))
              } info={{"Volume": Backend3D.volume(geometry).toPrecision(currentDecimalPlaces+2),
              "Surface Area": Backend3D.surfaceArea(geometry).toPrecision(currentDecimalPlaces+2),
              "Perimeter": Backend3D.perimeter(geometry).toPrecision(currentDecimalPlaces+2),
              "IoU": calculateIoU().toPrecision(currentDecimalPlaces+2)}} />
          ) }
        </mesh>
    );
};

export default IOUPolyhedron;
