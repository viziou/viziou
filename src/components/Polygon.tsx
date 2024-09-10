import { useContext, useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import { DragControls } from "@react-three/drei";
import { useThree, ThreeEvent } from "@react-three/fiber";

type PolygonProps = PolygonData & { index: number; selectable: boolean };

// TODO: Make information on top of the polygon as a child instead?

const Polygon = ({ position, geometry, colour, index, selectable }: PolygonProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { dispatch, selectedPolygonIndex, currentlyMousedOverPolygons } =
    useContext(PolygonContext)!;
  const originalPosition = useRef<[number, number]>([0, 0]);
  const matrix = new THREE.Matrix4();
  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);
  const { scene, camera, gl } = useThree();
  const [scale, setScale] = useState<[number, number]>([1, 1]);
  const [mousePosition, setMousePosition] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (mesh.current) {
      const box = new THREE.Box3().setFromObject(mesh.current);
      setBoundingBox(box);
    }
  }, [geometry, position, scale, mousePosition]);

  const selectPolygon = () => {
    if (!selectable) return;
    if (
      (selectedPolygonIndex === null || Math.max(...currentlyMousedOverPolygons) === index) &&
      dispatch
    ) {
      // only select the largest polygon index
      dispatch({ type: "SELECT_POLYGON", index: index });
    }
  };

  const isPolygonSelected = () => {
    return selectedPolygonIndex === index;
  };

  // uncomment this if it becomes useful
  // const deselectPolygon = () => {
  //   if (dispatch) dispatch({ type: "SELECT_POLYGON", index: null });
  // };

  const handleDragEnd = () => {
    /* Could trigger updates to IoU or something here maybe */
  };

  const handleDragStart = () => {
    // selectPolygon();
    if (mesh.current && isPolygonSelected()) {
      const v = new THREE.Vector3();
      mesh.current.getWorldPosition(v);
      originalPosition.current = v.toArray().slice(0, 2) as [number, number];
      //console.log('original_position: ', originalPosition);
    }
  };

  const handleDrag = (localMatrix: THREE.Matrix4) => {
    // TODO: research if there's a faster way to decompose
    if (mesh.current && isPolygonSelected()) {
      const new_v = new THREE.Vector3();
      localMatrix.decompose(new_v, new THREE.Quaternion(), new THREE.Vector3());
      const new_pos = new_v.toArray().slice(0, 2) as [number, number];
      //console.log('original position (inside handleDrag): ', originalPosition);
      new_pos[0] += originalPosition.current[0];
      new_pos[1] += originalPosition.current[1]; // TODO: this is ugly
      if (dispatch) {
        dispatch({
          type: "UPDATE_POSITION",
          index: index,
          position: new_pos,
        });
      }
    }
    // console.log('mouse over', currentlyMousedOverPolygons)
  };


  

  // get the position of the mouse in terms of the 3JS coordinates
  const getWorldPosition = (event: ThreeEvent<MouseEvent>) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = gl.domElement.getBoundingClientRect();
    const x = ((clientX - left) / width) * 2 - 1;
    const y = -((clientY - top) / height) * 2 + 1;

    const pos = new THREE.Vector3(x, y, 0);
    pos.unproject(camera as THREE.OrthographicCamera);
    return pos;
  };

  
  //! RESIZE FUNCTIONS:
  const [resizing, setResizing] = useState(false);
  const [corner, setCorner] = useState<string | null>(null);
  const [initialMousePosition, setInitialMousePosition] = useState<THREE.Vector3 | null>(null);
  const [initialScale, setInitialScale] = useState<[number, number]>([1, 1]);
  const [initialSize, setInitialSize] = useState<THREE.Vector3 | null>(null);

  const handleResizeStart = (corner: string, event: ThreeEvent<MouseEvent>) => {
    setResizing(true);
    setCorner(corner);
    setInitialMousePosition(getWorldPosition(event));
    setInitialScale([...scale]);
    if (boundingBox) {
      setInitialSize(boundingBox.getSize(new THREE.Vector3()));
    }
  }

  const handleResizeDrag = (event: ThreeEvent<MouseEvent>) => {
    if (!resizing || !boundingBox || !initialMousePosition || !corner || !mesh.current || !initialSize) return;

    const newMousePosition = getWorldPosition(event);
    const mouseDelta = newMousePosition.sub(initialMousePosition);
    
    let newScale = [...initialScale];
    let newPosition: [number, number] = [...position];

    switch (corner) {
      case 'topLeft':
        newScale[0] = initialScale[0] * (1 - mouseDelta.x / initialSize.x);
        newScale[1] = initialScale[1] * (1 + mouseDelta.y / initialSize.y);
        newPosition[0] += mouseDelta.x / 2;
        newPosition[1] += mouseDelta.y / 2;
        break;
      case 'topRight':
        newScale[0] = initialScale[0] * (1 + mouseDelta.x / initialSize.x);
        newScale[1] = initialScale[1] * (1 + mouseDelta.y / initialSize.y);
        newPosition[0] += mouseDelta.x / 2;
        newPosition[1] += mouseDelta.y / 2;
        break;
      case 'bottomLeft':
        newScale[0] = initialScale[0] * (1 - mouseDelta.x / initialSize.x);
        newScale[1] = initialScale[1] * (1 - mouseDelta.y / initialSize.y);
        newPosition[0] += mouseDelta.x / 2;
        newPosition[1] += mouseDelta.y / 2;
        break;
      case 'bottomRight':
        newScale[0] = initialScale[0] * (1 + mouseDelta.x / initialSize.x);
        newScale[1] = initialScale[1] * (1 - mouseDelta.y / initialSize.y);
        newPosition[0] += mouseDelta.x / 2;
        newPosition[1] += mouseDelta.y / 2;
        break;
    }

    // Apply the new scale and position
    const scaleMatrix = new THREE.Matrix4().makeScale(newScale[0], newScale[1], 1);
    const translateMatrix = new THREE.Matrix4().makeTranslation(
      newPosition[0] - position[0],
      newPosition[1] - position[1],
      0
    );

    const combinedMatrix = new THREE.Matrix4().multiply(translateMatrix).multiply(scaleMatrix);

    const newGeometry = geometry.clone().applyMatrix4(combinedMatrix);

    if (dispatch) {
      dispatch({ type: "UPDATE_GEOMETRY", geometry: newGeometry, index: index });
      dispatch({ type: "UPDATE_POSITION", index: index, position: newPosition });
    }

    setScale(newScale as [number, number]);
    
    // Update bounding box immediately
    if (mesh.current) {
      const newBox = new THREE.Box3().setFromObject(mesh.current);
      setBoundingBox(newBox);
    }
  }

  const handleResizeEnd = (_: ThreeEvent<MouseEvent>) => {
    setResizing(false);
    setCorner(null);
    setInitialMousePosition(null);
    setInitialScale([1, 1]);
    setInitialSize(null);
    selectPolygon();
  }

  //! ROTATE FUNCTIONS:
  const [rotating, setRotating] = useState(false);
  const [rotationCenter, setRotationCenter] = useState<THREE.Vector3 | null>(null);
  const [initialRotation, setInitialRotation] = useState(0);
  const [totalRotation, setTotalRotation] = useState(0);

  const handleRotateStart = (e: ThreeEvent<MouseEvent>) => {
    setRotating(true);
    setMousePosition(getWorldPosition(e));
    if (boundingBox) {
      const center = boundingBox.getCenter(new THREE.Vector3());
      setRotationCenter(center);
      const angle = Math.atan2(e.point.y - center.y, e.point.x - center.x);
      setInitialRotation(angle);
    }
  }

  const handleRotateDrag = (event: ThreeEvent<MouseEvent>) => {
    if (!rotating || !mousePosition || !rotationCenter || !mesh.current) return;

    const newMousePosition = getWorldPosition(event);

    // Calculate angle difference
    const newAngle = Math.atan2(newMousePosition.y - rotationCenter.y, newMousePosition.x - rotationCenter.x);
    let angleDiff = newAngle - initialRotation;

    // Ensure continuous rotation
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    const newTotalRotation = totalRotation + angleDiff;

    // Create rotation matrix
    const rotationMatrix = new THREE.Matrix4().makeRotationZ(newTotalRotation / 270);  // this 270 is magic number that seems to work well

    // Apply rotation to geometry
    const newGeometry = geometry.clone().applyMatrix4(rotationMatrix);

    // Update position
    const worldPosition = new THREE.Vector3();
    mesh.current.getWorldPosition(worldPosition);
    const localPosition = worldPosition.sub(rotationCenter);
    localPosition.applyMatrix4(rotationMatrix);
    const newPosition = localPosition.add(rotationCenter);

    if (dispatch) {
      dispatch({ type: "UPDATE_GEOMETRY", geometry: newGeometry, index: index });
      dispatch({ type: "UPDATE_POSITION", index: index, position: [newPosition.x, newPosition.y] });
    }

    setTotalRotation(newTotalRotation);
    setMousePosition(newMousePosition);
    setInitialRotation(newAngle);

    // Update bounding box immediately
    if (mesh.current) {
      const newBox = new THREE.Box3().setFromObject(mesh.current);
      setBoundingBox(newBox);
    }
  }

  const handleRotateEnd = (_: ThreeEvent<MouseEvent>) => {
    setRotating(false);
    setRotationCenter(null);
    setInitialRotation(0);
  }



  // bounding box component:
  const BoundingBox = useMemo(() => {
    if (!boundingBox || !isPolygonSelected()) return null;

    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());

    return (
      <group position={center}>
        {/* Invisible large box to allow dragging when the drag points aren't moused over: */}
        {resizing || rotating ? <mesh key={'invisible'} visible={false}
        onPointerMove={(e) => {
          if (resizing) handleResizeDrag(e);
          if (rotating) handleRotateDrag(e);
        }}

        onPointerUp={(e) => {
          handleResizeEnd(e);
          handleRotateEnd(e);
        }}

        onPointerLeave={(e) => {
          if (resizing) handleResizeEnd(e);
          if (rotating) handleRotateEnd(e);
        }}
        >
        <boxGeometry args={[size.x*10, size.y*10, 0]} />
        
        </mesh> : null}
        {/* Red Lines to show bounding box: */}
        {!rotating && !resizing ? 
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={5}
              array={new Float32Array([
                -size.x/2, -size.y/2, 0,
                size.x/2, -size.y/2, 0,
                size.x/2, size.y/2, 0,
                -size.x/2, size.y/2, 0,
                -size.x/2, -size.y/2, 0
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="red" />
        </line>
        : null }
        {/* Boxes on each corner: */}
        {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((corner, i) => (
          <mesh
            key={corner}
            position={[
              (i % 2 === 0 ? -1 : 1) * size.x / 2,
              (i < 2 ? 1 : -1) * size.y / 2,
              0
            ]}
            onPointerDown={(e) => {handleResizeStart(corner, e);}}
          >
            <boxGeometry args={[0.2, 0.2, 0]} />
            <meshBasicMaterial color="blue" />
          </mesh>
        ))}
        {/* Rotate circle: */}
        <mesh
          position={[0, size.y / 2 + 0.5, 0]}
          onPointerDown={handleRotateStart}

          onPointerMove={handleRotateDrag}

          onPointerUp={handleRotateEnd}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="green" />
        </mesh>
        {/* Line to Rotate circle: */}
        {!resizing && !rotating ? 
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                0, size.y / 2, 0,
                0, size.y / 2 + 0.5, 0,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="red" />
        </line> : null}
      </group>
    );
  }, [boundingBox, isPolygonSelected, scene]);

  return (
    <>
      <DragControls
        matrix={matrix}
        autoTransform={false}
        onDragStart={handleDragStart}
        onDrag={(localMatrix) => {
          handleDrag(localMatrix);
          // Update bounding box immediately during drag
          if (mesh.current) {
            const newBox = new THREE.Box3().setFromObject(mesh.current);
            setBoundingBox(newBox);
          }
        }}
        onDragEnd={handleDragEnd}
      >
        <mesh
          position={[position[0], position[1], 0]}
          geometry={geometry}
          ref={mesh}
          onPointerEnter={() => {
            if (dispatch)
              dispatch({ type: "ADD_MOUSED_OVER_POLYGON", index: index });
          }}
          onPointerLeave={() => {
            if (dispatch)
              dispatch({ type: "REMOVE_MOUSED_OVER_POLYGON", index: index });
          }}
          onClick={selectPolygon}
        >
          <meshBasicMaterial
            color={colour}
          />
        </mesh>
      </DragControls>
      {BoundingBox}
    </>
  );
};

export default Polygon;
