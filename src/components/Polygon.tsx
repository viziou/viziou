import { useContext, useRef, useState } from "react";
import * as THREE from "three";
import { PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import { useThree } from "@react-three/fiber";

type PolygonProps = PolygonData & { index: number };

const Polygon = ({ position, geometry, colour, index }: PolygonProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { dispatch } = useContext(PolygonContext)!;
    const [isDragging, setIsDragging] = useState(false);
    const { camera, gl, viewport } = useThree();
    const [initialOffset, setInitialOffset] = useState<[number, number] | null>(null);

    const handleMouseDown = (event: THREE.PointerEvent) => {
      if (event.button !== 2) {
          return;
      }
      event.stopPropagation();
      setIsDragging(true);

      // convert initial mouse down position to world coordinates:
      const normalisedMouseCoordinates=  new THREE.Vector2( (event.clientX / gl.domElement.clientWidth) * 2 - 1, -(event.clientY / gl.domElement.clientHeight)*2 + 1);
      const worldCoordinates = new THREE.Vector3(normalisedMouseCoordinates.x, normalisedMouseCoordinates.y, 0)//.unproject(camera);

      // set the initial offset:
      if (mesh.current) {
          setInitialOffset([
              worldCoordinates.x - mesh.current.position.x,
              worldCoordinates.y - mesh.current.position.y,
          ]);
      }
    };

    const handleMouseMove = (event: THREE.PointerEvent) => {
      if (isDragging && initialOffset) {
        event.stopPropagation();
        if (mesh.current) {
          const normalisedMouseCoordinates=  new THREE.Vector2( (event.clientX / gl.domElement.clientWidth) * 2 - 1, -(event.clientY / gl.domElement.clientHeight)*2 + 1);
          const worldCoordinates = new THREE.Vector3(normalisedMouseCoordinates.x, normalisedMouseCoordinates.y, 0)//.unproject(camera);

          // adjust the scale based on the camera's current zoom level:
          const scaleX = viewport.width / gl.domElement.clientWidth;
          const scaleY = viewport.height / gl.domElement.clientHeight;

          const newPosition: [number, number] = [
              (worldCoordinates.x - initialOffset[0]) * scaleX * 100,
              (worldCoordinates.y - initialOffset[1]) * scaleY * 100,
          ];

          // Update mesh position:
          mesh.current.position.set(...newPosition, 0);

          // update Polygon array state:
          if (dispatch) {
            dispatch({ type: "UPDATE_POSITION", index: index, position: newPosition });
          }
        }
      }
    };

    const handleMouseUp = (event: THREE.PointerEvent) => {
      event.stopPropagation();
      setIsDragging(false);
      setInitialOffset(null);
    };

  return (
    <mesh
      position={[position[0], position[1], 0]}
      geometry={geometry}
      ref={mesh}
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp} // treat leaving the polygon as stopping the click
    >
      <meshBasicMaterial color={colour} />
    </mesh>
  );
};

export default Polygon;
