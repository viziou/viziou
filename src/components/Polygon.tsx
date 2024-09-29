import { useContext, useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import { DragControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import edit from '../assets/new_edit.png';
import bin from '../assets/new_bin.png';
import duplicate from '../assets/new_duplicate.png';
// import Infographic from "./Infographic";

type PolygonProps = PolygonData & { index: number; selectable: boolean };

// Load texture icons
const editIconTexture = new THREE.TextureLoader().load(edit);
const deleteIconTexture = new THREE.TextureLoader().load(bin);
const duplicateIconTexture = new THREE.TextureLoader().load(duplicate);

// TODO: Make information on top of the polygon as a child instead?

const Polygon = ({
  position,
  geometry,
  colour,
  index,
  selectable,
}: PolygonProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const { dispatch, selectedPolygonIndex, currentlyMousedOverPolygons, selectability, polygons } = useContext(PolygonContext)!;
  const originalPosition = useRef<[number, number]>([0, 0]);
  const matrix = new THREE.Matrix4();
  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);
  const { scene, camera, pointer } = useThree();
  const [mousePointer, setMousePointer] = useState<string | null>(null);
  const [resizing, setResizing] = useState(false);
  const [corner, setCorner] = useState<string | null>(null);
  const [rotating, setRotating] = useState(false);
  const [orientation, setOrientation] = useState(0);

  useEffect(() => {
    if (mesh.current) {
      const box = new THREE.Box3().setFromObject(mesh.current);
      setBoundingBox(box);
    }
  }, [geometry, position]);

  const selectPolygon = () => {
    if (!selectability || !selectable) return;
    if ((selectedPolygonIndex === null || Math.max(...currentlyMousedOverPolygons) === index) && dispatch) {
      // only select the largest polygon index
      dispatch({ type: "SELECT_POLYGON", index: index });
    }
  };

  const isPolygonSelected = () => {
    return selectedPolygonIndex === index;
  };

  /**********************************/
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
  /**********************************/

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

  const getCanvasMousePosition = () => {
    const vec = new THREE.Vector3(); // create once and reuse
    const pos = new THREE.Vector3(); // create once and reuse
    vec.set(
      pointer.x,
      pointer.y,
      0.5,
    );
    vec.unproject(camera as THREE.OrthographicCamera);
    vec.sub(camera.position).normalize();
    const distance = -camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));
    return pos
  };  

  /**********************************/
  const handleResizeStart = (corner: string) => {
    setResizing(true);
    setCorner(corner);
    if (dispatch)
      dispatch({ type: "SELECTABILITY",  payload: false});
  };

  const handleResizeDrag = () => {
    if (!resizing || !boundingBox || !corner)
      return;

    // Obtain bounding box size and center
    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());

    // Get mouse position relative to the box center
    const mousePosition = getCanvasMousePosition().sub(center);

    // Initialise corner position
    let cornerPosition = new THREE.Vector3(0, 0, 0);

    // Calculate the corner position relative to the box center
    switch (corner) {
      case "topLeft":
        cornerPosition = size.divideScalar(2);
        cornerPosition.x *= -1;
        break;

      case "topRight":
        cornerPosition = size.divideScalar(2);
        break;

      case "bottomLeft":
        cornerPosition = size.divideScalar(2).multiplyScalar(-1);
        break;

      case "bottomRight":
        cornerPosition = size.divideScalar(2);
        cornerPosition.y *= -1;
        break;
    }

    // Calculate the multiplier needed to bring the corner box to the current mouse position
    const scaleX = mousePosition.x / cornerPosition.x;
    const scaleY = mousePosition.y / cornerPosition.y;

    // Create the translations to anchor all scaling to opposite corner
    // const translationX = center.x - position[0] - cornerPosition.x;
    // const translationY = center.y - position[1] - cornerPosition.y;
    const translationX = center.x - position[0];
    const translationY = center.y - position[1];

    // Translate from position to bbox center
    let newGeometry = geometry.clone();
    newGeometry.translate(-translationX, -translationY, 0);
    newGeometry.scale(scaleX, scaleY, 1);
    newGeometry.translate(translationX, translationY, 0);

    if (dispatch) {
      dispatch({
        type: "UPDATE_GEOMETRY",
        geometry: newGeometry,
        index: index,
      });
    }
  };

  const handleResizeEnd = () => {
    setResizing(false);
    setCorner(null);
  };
  /**********************************/

  /**********************************/
  const handleRotateStart = () => {
    setRotating(true);
    setOrientation(0);
    if (dispatch)
      dispatch({ type: "SELECTABILITY",  payload: false});
  };

  const handleRotateDrag = () => {
    if (!rotating || !boundingBox) 
      return;
    setMousePointer("move")

    // Obtain bounding box center
    const center = boundingBox.getCenter(new THREE.Vector3());

    // Get mouse position relative to the box center
    const mousePosition = getCanvasMousePosition().sub(center);

    // Calculate angle of new orientation w.r.t the vertical
    const vertical = new THREE.Vector3(0, 1, 0);
    let newOrientation = mousePosition.angleTo(vertical);
    if (mousePosition.cross(vertical).z > 0) {
      newOrientation *= -1;
    }

    // Calculate the angle to rotate
    const angleDiff = newOrientation - orientation;

    // Apply rotation to geometry
    const newGeometry = geometry.clone()
    const translationX = center.x - position[0];
    const translationY = center.y - position[1];
    newGeometry.translate(-translationX, -translationY, 0);
    newGeometry.rotateZ(angleDiff);
    newGeometry.translate(translationX, translationY, 0);

    if (dispatch) {
      dispatch({
        type: "UPDATE_GEOMETRY",
        geometry: newGeometry,
        index: index,
      });
    }

    setOrientation(newOrientation);
  };

  const handleRotateEnd = () => {
    setRotating(false);
    setOrientation(0);
    setMousePointer(null);
    if (dispatch) {
      dispatch({ type: "SELECTABILITY",  payload: true});
    }
  };
  /**********************************/

  const deleteSelectedPolygon = () => {
    document.body.style.cursor = "auto";
    if (dispatch) {
      dispatch({type: "DELETE_POLYGON", index: index})
      dispatch({ type: "SELECT_POLYGON", index: null });
    }
  }

  const duplicateSelectedPolygon = () => {
    if (dispatch) {
      dispatch({type: "DUPLICATE_POLYGON", index: index})
    }
  }

  const editSelectedPolygon = () => {
    if (dispatch) {
      dispatch({type: "SET_EDIT", index: index})
    }
  }

  // bounding box component:
  const BoundingBox = useMemo(() => {
    if (!boundingBox || !isPolygonSelected()) 
      return <></>;

    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());

    return (
      <group position={center}>
        {/* Invisible large box to allow dragging when the drag points aren't moused over: */}
        {resizing || rotating ? (
          <mesh
            key={"invisible"}
            visible={false}
            onPointerMove={(_) => {
              if (resizing) handleResizeDrag();
              if (rotating) handleRotateDrag();
            }}
            onPointerUp={(_) => {
              if (resizing) handleResizeEnd()
              if (rotating) handleRotateEnd();
            }}
            onPointerLeave={(_) => {
              if (resizing) handleResizeEnd();
              if (rotating) handleRotateEnd();
            }}
          >
            <boxGeometry args={[size.x * 100, size.y * 100, 0]} />
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
        {!rotating ? ["topLeft", "topRight", "bottomLeft", "bottomRight"].map(
          (corner, i) => (
            <mesh
              key={corner}
              position={[
                ((i % 2 === 0 ? -1 : 1) * size.x) / 2,
                ((i < 2 ? 1 : -1) * size.y) / 2,
                0,
              ]}
              onPointerDown={(_) => {
                handleResizeStart(corner);
              }}
              onPointerEnter={() => {
                setMousePointer(
                  corner === "topRight" || corner === "bottomLeft"
                    ? "nesw"
                    : "nwse"
                );
                if (dispatch && !rotating)
                  dispatch({ type: "SELECTABILITY",  payload: false});
              }}
              onPointerLeave={() => {
                setMousePointer(null);
                if (dispatch && !rotating)
                  dispatch({ type: "SELECTABILITY",  payload: true});
              }}
            >
              <boxGeometry args={[0.2, 0.2, 0]} />
              <meshBasicMaterial color="blue" />
            </mesh>
          )
        ) : null}

        {/* Rotate circle: */}
        {!rotating && !resizing ? <mesh
          position={[0, size.y / 2 + 0.5, 0]}
          onPointerDown={handleRotateStart}
          onPointerEnter={() => setMousePointer("move")}
          onPointerUp={() => setMousePointer(null)}
          onPointerLeave={() => setMousePointer(null)}
        >
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color="green" />
        </mesh> : null}

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
          <sprite
            position={[0.5, size.y / 2 + 0.5, 0]}
            onClick={editSelectedPolygon}
            onPointerEnter={() => setMousePointer("pointer")}
            onPointerLeave={() => setMousePointer(null)}
            onPointerUp={() => setMousePointer(null)}
            scale={[0.4, 0.4, 0]}
          >
            <spriteMaterial map={editIconTexture}/>
          </sprite>
        ) : null}        

        {/* Duplicate button */}
        {!resizing && !rotating ? (
          <sprite
            position={[1, size.y / 2 + 0.5, 0]}
            onClick={duplicateSelectedPolygon}
            onPointerEnter={() => setMousePointer("pointer")}
            onPointerLeave={() => setMousePointer(null)}
            onPointerUp={() => setMousePointer(null)}
            scale={[0.4, 0.4, 0]}
          >
            <spriteMaterial map={duplicateIconTexture}/>
          </sprite>
        ) : null}

        {/* Delete button */}
        {!resizing && !rotating ? (
          <sprite
            position={[1.5, size.y / 2 + 0.5, 0]}
            onClick={deleteSelectedPolygon}
            onPointerEnter={() => setMousePointer("pointer")}
            onPointerLeave={() => setMousePointer(null)}
            onPointerUp={() => setMousePointer(null)}
            scale={[0.4, 0.4, 0]}
          >
            <spriteMaterial map={deleteIconTexture}/>
          </sprite>
        ) : null}
      </group>
    );
  }, [boundingBox, isPolygonSelected, scene, polygons]);

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
        {/* Example infographic: */}
        {/* {Math.max(...currentlyMousedOverPolygons) === index && (
          <Infographic 
          position={!boundingBox ? new THREE.Vector3(position[0], position[1], 0) : boundingBox.getCenter(new THREE.Vector3).sub(boundingBox.getSize(new THREE.Vector3).multiplyScalar(0.5))
          } info={{"hi": "yeah", "hello": 12.345678.toPrecision(currentDecimalPlaces+2)}} />
        )} */}
      </DragControls>
      {BoundingBox}
    </>
  );
};

export default Polygon;
