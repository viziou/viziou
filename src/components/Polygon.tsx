/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { useContext, useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import { DragControls } from "@react-three/drei";
import { useThree, ThreeEvent } from "@react-three/fiber";

type PolygonProps = PolygonData & { index: number; selectable: boolean };

// Load texture icons
const editIconTexture = new THREE.TextureLoader().load("src/assets/edit.jpg")
const deleteIconTexture = new THREE.TextureLoader().load("src/assets/delete.jpg")
const duplicateIconTexture = new THREE.TextureLoader().load("src/assets/duplicate.jpg")

// TODO: Make information on top of the polygon as a child instead?

const Polygon = ({
  position,
  geometry,
  colour,
  index,
  selectable,
}: PolygonProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { dispatch, selectedPolygonIndex, currentlyMousedOverPolygons } = useContext(PolygonContext)!;
  const originalPosition = useRef<[number, number]>([0, 0]);
  const matrix = new THREE.Matrix4();
  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);
  const { scene, camera, pointer } = useThree();
  const [scale, setScale] = useState<[number, number]>([1, 1]);
  const [mousePosition, setMousePosition] = useState<THREE.Vector3 | null>(
    null
  );

  useEffect(() => {
    if (mesh.current) {
      const box = new THREE.Box3().setFromObject(mesh.current);
      setBoundingBox(box);
    }
  }, [geometry, position, scale, mousePosition]);

  const selectPolygon = () => {
    if (!selectable) return;
    if ((selectedPolygonIndex === null || Math.max(...currentlyMousedOverPolygons) === index) && dispatch) {
      // only select the largest polygon index
      dispatch({ type: "SELECT_POLYGON", index: index });
    }
  };

  const isPolygonSelected = () => {
    return selectedPolygonIndex === index;
  };

  const handleDragEnd = () => {
    /* Could trigger updates to IoU or something here maybe */
  };

  const handleDragStart = () => {
    if (!isPolygonSelected()) {
      selectPolygon();
    }
    if (mesh.current) {
      const v = new THREE.Vector3();
      mesh.current.getWorldPosition(v);
      originalPosition.current = v.toArray().slice(0, 2) as [number, number];
    }
  };

  const handleDrag = (localMatrix: THREE.Matrix4) => {
    // TODO: research if there's a faster way to decompose
    if (mesh.current && isPolygonSelected()) {
      const new_v = new THREE.Vector3();
      localMatrix.decompose(new_v, new THREE.Quaternion(), new THREE.Vector3());
      const new_pos = new_v.toArray().slice(0, 2) as [number, number];
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
  const getCanvasMousePosition = (_: ThreeEvent<MouseEvent>) => {
    const vec = new THREE.Vector3(); // create once and reuse
    const pos = new THREE.Vector3(); // create once and reuse
    vec.set(
      pointer.x,
      pointer.y,
      0.5,
    );
    vec.unproject( camera as THREE.OrthographicCamera);
    vec.sub( camera.position ).normalize();
    const distance = - camera.position.z / vec.z;
    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    return pos
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
    setInitialMousePosition(getCanvasMousePosition(event));
    setInitialScale([...scale]);
    if (boundingBox) {
      setInitialSize(boundingBox.getSize(new THREE.Vector3()));
    }
  };

  const handleResizeDrag = (event: ThreeEvent<MouseEvent>) => {
    if (
      !resizing ||
      !boundingBox ||
      !initialMousePosition ||
      !corner ||
      !mesh.current ||
      !initialSize
    )
      return;

    setInitialSize(boundingBox.getSize(new THREE.Vector3()));
    const mousePosition = getCanvasMousePosition(event);
    const bboxCenter = boundingBox.getCenter(new THREE.Vector3());
    const initialCornerLocation = bboxCenter.clone().add(initialSize.clone().divideScalar(2))
    // const relativeMousePosition = newMousePosition.sub(initialCornerLocation);
    // console.log(mouse);
    // console.log(initialCornerLocation);
    console.log(bboxCenter);
    
    
    // const mouseDelta = newMousePosition.sub(initialMousePosition);

    let newScale = [1, 1];
    let newPosition: [number, number] = [...position];
    // let translateCornerToOriginMatrix = new THREE.Matrix4();

    switch (corner) {
      case "topRight":
        newScale[0] = mousePosition.x / initialCornerLocation.x;
        newScale[1] = mousePosition.y / initialCornerLocation.y;


        // console.log(newScale)
        // newPosition[0] += mouseDelta.x / 2;
        // newPosition[1] += mouseDelta.y / 2;
        // translateCornerToOriginMatrix = new THREE.Matrix4().makeTranslation(
        //   -position[0],
        //   -position[1],
        //   0
        // );
        break;
    }

    // Apply the new scale and position
    
    const scaleMatrix = new THREE.Matrix4().makeScale(
      newScale[0],
      newScale[1],
      1
    );
    // console.log(scaleMatrix);
    // const translateMatrix = new THREE.Matrix4().makeTranslation(
    //   -initialSize.x/2,
    //   -initialSize.y/2,
    //   0
    // );

    // const translateMatrix2 = new THREE.Matrix4().makeTranslation(
    //   +initialSize.x/2,
    //   +initialSize.y/2,
    //   0
    // );

    const combinedMatrix = new THREE.Matrix4()
      // .multiply(translateCornerToOriginMatrix)
      // .multiply(translateMatrix)
      .multiply(scaleMatrix)
      // .multiply(translateMatrix2)
      ;
      

    const newGeometry = geometry.clone().applyMatrix4(combinedMatrix);
    // const newGeometry = geometry.clone();

    if (dispatch) {
      dispatch({
        type: "UPDATE_GEOMETRY",
        geometry: newGeometry,
        index: index,
      });
      // dispatch({
      //   type: "UPDATE_POSITION",
      //   index: index,
      //   position: newPosition,
      // });
    }

    // setScale(newScale as [number, number]);

    // Update bounding box immediately
    if (mesh.current) {
      const newBox = new THREE.Box3().setFromObject(mesh.current);
      setBoundingBox(newBox);
    }

    if (boundingBox) {
      setInitialSize(boundingBox.getSize(new THREE.Vector3()));
    }
  };

  const handleResizeEnd = (_: ThreeEvent<MouseEvent>) => {
    setResizing(false);
    setCorner(null);
    setInitialMousePosition(null);
    setInitialScale([1, 1]);
    setInitialSize(null);
    setMousePointer(null);
    selectPolygon();
  };

  const [mousePointer, setMousePointer] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.cursor =
      mousePointer === "nesw"
        ? `nesw-resize`
        : mousePointer === "nwse"
        ? "nwse-resize"
        : mousePointer === "move"
        ? "move"
        : mousePointer === "pointer"
        ? "pointer"
        : "auto";
  }, [mousePointer]);

  //! ROTATE FUNCTIONS:
  const [rotating, setRotating] = useState(false);
  const [rotationCenter, setRotationCenter] = useState<THREE.Vector3 | null>(
    null
  );
  const [initialRotation, setInitialRotation] = useState(0);
  const [totalRotation, setTotalRotation] = useState(0);

  const handleRotateStart = (e: ThreeEvent<MouseEvent>) => {
    setRotating(true);
    setMousePosition(getCanvasMousePosition(e));
    if (boundingBox) {
      const center = boundingBox.getCenter(new THREE.Vector3());
      setRotationCenter(center);
      const angle = Math.atan2(e.point.y - center.y, e.point.x - center.x);
      setInitialRotation(angle);
    }
    setMousePointer("move");
  };

  const handleRotateDrag = (event: ThreeEvent<MouseEvent>) => {
    if (!rotating || !mousePosition || !rotationCenter || !mesh.current) return;

    const newMousePosition = getCanvasMousePosition(event);

    // Calculate angle difference
    const newAngle = Math.atan2(
      newMousePosition.y - rotationCenter.y,
      newMousePosition.x - rotationCenter.x
    );
    let angleDiff = newAngle - initialRotation;

    // Ensure continuous rotation
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    const newTotalRotation = totalRotation + angleDiff;

    // Create rotation matrix
    const rotationMatrix = new THREE.Matrix4().makeRotationZ(
      newTotalRotation / 270
    ); // this 270 is magic number that seems to work well

    // Apply rotation to geometry
    const newGeometry = geometry.clone().applyMatrix4(rotationMatrix);

    // Update position
    const worldPosition = new THREE.Vector3();
    mesh.current.getWorldPosition(worldPosition);
    const localPosition = worldPosition.sub(rotationCenter);
    localPosition.applyMatrix4(rotationMatrix);
    const newPosition = localPosition.add(rotationCenter);

    if (dispatch) {
      dispatch({
        type: "UPDATE_GEOMETRY",
        geometry: newGeometry,
        index: index,
      });
      dispatch({
        type: "UPDATE_POSITION",
        index: index,
        position: [newPosition.x, newPosition.y],
      });
    }

    setTotalRotation(newTotalRotation);
    setMousePosition(newMousePosition);
    setInitialRotation(newAngle);
    setMousePointer("move");

    // Update bounding box immediately
    if (mesh.current) {
      const newBox = new THREE.Box3().setFromObject(mesh.current);
      setBoundingBox(newBox);
    }
  };

  const handleRotateEnd = (_: ThreeEvent<MouseEvent>) => {
    setRotating(false);
    setRotationCenter(null);
    setInitialRotation(0);
    setMousePointer(null);
  };


  // Handler for deleting polygon
  const deleteSelectedPolygon = () => {
    document.body.style.cursor = "auto";
    if (dispatch) {
      dispatch({type: "DELETE_POLYGON", index: index})
    }
  }

  // Handler for duplicating polygon
  const duplicateSelectedPolygon = () => {
    if (dispatch) {
      dispatch({type: "DUPLICATE_POLYGON", index: index})
    }
  }

  // Handler for editing polygon
  const editSelectedPolygon = () => {
    if (dispatch) {
      dispatch({type: "SET_EDIT", index: index})
    }
  }


  // bounding box component:
  const BoundingBox = useMemo(() => {
    if (!boundingBox || !isPolygonSelected()) return null;

    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());

    return (
      <group position={center}>
        {/* Invisible large box to allow dragging when the drag points aren't moused over: */}
        {resizing || rotating ? (
          <mesh
            key={"invisible"}
            visible={false}
            onPointerMove={(e) => {
              if (resizing) handleResizeDrag(e);
              if (rotating) handleRotateDrag(e);
            }}
            onPointerUp={(e) => {
              if (resizing) handleResizeEnd(e);
              if (rotating) handleRotateEnd(e);
            }}
            onPointerLeave={(e) => {
              if (resizing) handleResizeEnd(e);
              if (rotating) handleRotateEnd(e);
            }}
          >
            <boxGeometry args={[size.x * 100, size.y * 100, 0]} />
            {/* <meshBasicMaterial color="green" /> */}
          </mesh>
        ) : null}

        {/* Red Lines to show bounding box: */}
        {!rotating && !resizing ? (
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={5}
                array={
                  new Float32Array([
                    -size.x / 2,
                    -size.y / 2,
                    0,
                    size.x / 2,
                    -size.y / 2,
                    0,
                    size.x / 2,
                    size.y / 2,
                    0,
                    -size.x / 2,
                    size.y / 2,
                    0,
                    -size.x / 2,
                    -size.y / 2,
                    0,
                  ])
                }
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="red" />
          </line>
        ) : null}

        {/* Boxes on each corner: */}
        {["topLeft", "topRight", "bottomLeft", "bottomRight"].map(
          (corner, i) => (
            <mesh
              key={corner}
              position={[
                ((i % 2 === 0 ? -1 : 1) * size.x) / 2,
                ((i < 2 ? 1 : -1) * size.y) / 2,
                0,
              ]}
              onPointerDown={(e) => {
                handleResizeStart(corner, e);
              }}
              onPointerEnter={() => {
                setMousePointer(
                  corner === "topRight" || corner === "bottomLeft"
                    ? "nesw"
                    : "nwse"
                );
              }}
              onPointerLeave={() => {
                if (!resizing)setMousePointer(null);
              }}
            >
              <boxGeometry args={[0.2, 0.2, 0]} />
              <meshBasicMaterial color="blue" />
            </mesh>
          )
        )}

        {/* Rotate circle: */}
        <mesh
          position={[0, size.y / 2 + 0.5, 0]}
          onPointerDown={handleRotateStart}
          onPointerEnter={() => setMousePointer("move")}
          onPointerLeave={() => setMousePointer(null)}
          onPointerMove={handleRotateDrag}
          onPointerUp={handleRotateEnd}
        >
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="green" />
        </mesh>

        {/* Line to Rotate circle: */}
        {!resizing && !rotating ? (
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={
                  new Float32Array([0, size.y / 2, 0, 0, size.y / 2 + 0.5 - 0.1, 0])
                }
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="red" />
          </line>
        ) : null}

        {/* Edit button */}
        {!resizing && !rotating ? (
          <group>
            <mesh
              position={[0.5, size.y / 2 + 0.5, 0]}
            >
              <circleGeometry args={[0.21, 64]} />
              <meshBasicMaterial color={"black"}/>
            </mesh>
            <mesh
              position={[0.5, size.y / 2 + 0.5, 0]}
              onClick={editSelectedPolygon}
              onPointerEnter={() => setMousePointer("pointer")}
              onPointerLeave={() => setMousePointer(null)}
              onPointerUp={() => setMousePointer(null)}
            >
              <circleGeometry args={[0.2, 64]} />
              <meshBasicMaterial map={editIconTexture}/>
            </mesh>
          </group>
        ) : null}        

        {/* Duplicate button */}
        {!resizing && !rotating ? (
          <group>
            <mesh
              position={[1, size.y / 2 + 0.5, 0]}
            >
              <circleGeometry args={[0.21, 64]} />
              <meshBasicMaterial color={"black"}/>
            </mesh>
            <mesh
              position={[1, size.y / 2 + 0.5, 0]}
              onClick={duplicateSelectedPolygon}
              onPointerEnter={() => setMousePointer("pointer")}
              onPointerLeave={() => setMousePointer(null)}
              onPointerUp={() => setMousePointer(null)}
            >
              <circleGeometry args={[0.2, 64]} />
              <meshBasicMaterial map={duplicateIconTexture}/>
            </mesh>
          </group>
        ) : null}

        {/* Delete button */}
        {!resizing && !rotating ? (
          <group>
            <mesh
              position={[1.5, size.y / 2 + 0.5, 0]}
            >
              <circleGeometry args={[0.21, 64]} />
              <meshBasicMaterial color={"black"}/>
            </mesh>
            <mesh
              position={[1.5, size.y / 2 + 0.5, 0]}
              onClick={deleteSelectedPolygon}
              onPointerEnter={() => setMousePointer("pointer")}
              onPointerLeave={() => setMousePointer(null)}
            >
              <circleGeometry args={[0.2, 64]} />
              <meshBasicMaterial map={deleteIconTexture}/>
            </mesh>
          </group>
        ) : null}
      </group>
    );
  }, [boundingBox, isPolygonSelected, scene]);

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
          onPointerEnter={() => {
            if (dispatch)
              dispatch({ type: "ADD_MOUSED_OVER_POLYGON", index: index });
          }}
          onPointerLeave={() => {
            if (dispatch)
              dispatch({ type: "REMOVE_MOUSED_OVER_POLYGON", index: index });
          }}
          onClick={selectPolygon}
          // TEsting:
          onDoubleClick={editSelectedPolygon}
        >
          <meshBasicMaterial color={colour} />
        </mesh>
      </DragControls>
      {BoundingBox}
    </>
  );
};

export default Polygon;
