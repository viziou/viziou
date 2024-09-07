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
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    if (mesh.current) {
      const box = new THREE.Box3().setFromObject(mesh.current);
      setBoundingBox(box);
    }
  }, [geometry, position, rotation, scale]);

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
  const [corner, setCorner] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState<THREE.Vector3 | null>(null);

  const handleResizeStart = (corner: string, event: ThreeEvent<MouseEvent>) => {
    setResizing(true);
    setMousePosition(getWorldPosition(event));
    setCorner(corner);
  }

  const handleResizeDrag = (event: ThreeEvent<MouseEvent>) => {
    if (!resizing || !boundingBox || !mousePosition || !corner) return;
    // todo:
    console.log("resize dragging");

    // const mouseDelta = (event as any).delta;
    const newMousePosition = getWorldPosition(event);
    const mouseDelta = newMousePosition.sub(mousePosition);
    const size = boundingBox.getSize(new THREE.Vector3());
    // console.log(mouseDelta);
    let newScale = [1, 1];

    switch (corner) {
      case 'topLeft':
        newScale[0] -= mouseDelta.x / size.x;
        newScale[1] += mouseDelta.y / size.y;
        break;
      case 'topRight':
        newScale[0] += mouseDelta.x / size.x;
        newScale[1] += mouseDelta.y / size.y;
        break;
      case 'bottomLeft':
        newScale[0] -= mouseDelta.x / size.x;
        newScale[1] -= mouseDelta.y / size.y;
        break;
      case 'bottomRight':
        newScale[0] += mouseDelta.x / size.x;
        newScale[1] -= mouseDelta.y / size.y;
        break;
    }

    // todo: use this scale and the currently selected corner to transform the points in the geometry
    console.log('mouse delta', mouseDelta)
    console.log('new scale', newScale)
    setScale(newScale as [number, number]);
    const geometry = mesh.current.geometry;
    const matrix = new THREE.Matrix4().makeScale(newScale[0], newScale[1], 1);
    geometry.applyMatrix4(matrix);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    
    if (dispatch) dispatch({type: "UPDATE_GEOMETRY", geometry: geometry, index: index})
    // setMousePosition(newMousePosition);/
  }

  const handleResizeEnd = (event: ThreeEvent<MouseEvent>) => {
    setResizing(false);
    setCorner(null);
    selectPolygon();
    console.log("resize ended");
  }

  //! ROTATE FUNCTIONS:
  const [rotating, setRotating] = useState(false);

  const handleRotateStart = (event: ThreeEvent<MouseEvent>) => {
    setRotating(true);
    // todo:
    console.log("rotate start");

  }

  const handleRotateDrag = (event: ThreeEvent<MouseEvent>) => {
    if (!rotating) return;
    // todo:
    console.log("rotate dragging");
  }

  const handleRotateEnd = (event: ThreeEvent<MouseEvent>) => {
    setRotating(false);
    // todo:
    console.log("rotate ended");
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
        <boxGeometry args={[size.x*2, size.y*2, 0]} />
        
        </mesh> : null}
        {/* Red Lines to show bounding box: */}
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
        </line>
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
