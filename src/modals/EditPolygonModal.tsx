import { useState, useRef, useEffect } from "react";
import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import {
  Vector3,
  OrthographicCamera,
  BufferGeometry,
  NormalBufferAttributes,
} from "three";
import { OrbitControls } from "@react-three/drei";
import "../styles/Modal.css";
import { ConvexGeometry } from "../backend/Interface";
import Polygon from "../components/Polygon";
import { HexColorPicker } from "react-colorful";

interface EditPolygonProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (points: [number, number][], colour: string) => void;
  initialPoints: [number, number][];
  initialColour: string;
}

interface Point {
  position: Vector3;
}

interface PolygonEditorProps {
  setPointsArray: (p: Point[]) => void;
  displayColour: string;
  initialPoints: Point[];
}

const PolygonEditor = ({
  setPointsArray,
  displayColour,
  initialPoints,
}: PolygonEditorProps) => {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [geometry, setGeometry] =
    useState<BufferGeometry<NormalBufferAttributes> | null>(
      points.length >= 3 &&
        ConvexGeometry.reducePointsToConvexHull(points.map((p) => p.position))
          .length === points.length
        ? ConvexGeometry.fromPoints(points.map((p) => p.position))
        : null
    );
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    updatePoints(initialPoints);
  }, [initialPoints]);

  const updatePoints = (newPoints: Point[]) => {
    const newConvexHullPoints = ConvexGeometry.reducePointsToConvexHull(
      newPoints.map((p) => p.position)
    );

    if (newConvexHullPoints.length === newPoints.length) {
      // set points array in this component AND parent component
      setPoints(newPoints);
      setPointsArray(newPoints);

      if (newPoints.length >= 3) {
        setGeometry(
          ConvexGeometry.fromPoints(newPoints.map((p) => p.position))
        );
      } else {
        setGeometry(null);
      }
    }
  };

  // add a point at the position where the user clicked:
  const handleCanvasClick = (event: ThreeEvent<MouseEvent>) => {
    if (draggedPoint !== null) return;

    const pos = getWorldPosition(event);
    const newPoints = [...points, { position: pos }];
    updatePoints(newPoints);
  };

  const handlePointDragStart = (
    event: ThreeEvent<MouseEvent>,
    index: number
  ) => {
    event.stopPropagation();
    setDraggedPoint(index);
    setHovered(true);
  };

  const handleDrag = (event: ThreeEvent<MouseEvent>) => {
    if (draggedPoint === null) return;

    const pos = getWorldPosition(event);
    const newPoints = points.map((point, i) =>
      i === draggedPoint ? { position: pos } : point
    );

    updatePoints(newPoints);
  };

  const handleDragEnd = () => {
    setDraggedPoint(null);
    setHovered(false);
  };

  const getWorldPosition = (event: ThreeEvent<MouseEvent>) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = gl.domElement.getBoundingClientRect();
    const x = ((clientX - left) / width) * 2 - 1;
    const y = -((clientY - top) / height) * 2 + 1;

    const pos = new Vector3(x, y, 0);
    pos.unproject(camera as OrthographicCamera);
    return pos;
  };

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  return (
    <>
      <mesh
        onClick={handleCanvasClick}
        onPointerMove={handleDrag}
        onPointerUp={handleDragEnd}
        onPointerLeave={handleDragEnd}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {geometry ? (
        <Polygon
          id={0}
          geometry={geometry}
          colour={displayColour}
          position={[0, 0]}
          index={points.length + 2}
          selectable={false}
          opacity={1}
        />
      ) : (
        <></>
      )}
      {points.map((point, index) => (
        <mesh
          key={index}
          position={point.position}
          onPointerDown={(e) => handlePointDragStart(e, index)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))}
    </>
  );
};

const EditPolygonModal = ({
  isOpen,
  onClose,
  onSave,
  initialPoints,
  initialColour,
}: EditPolygonProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [displayColour, setDisplayColour] = useState<string>(initialColour);
  const [showColourPicker, setShowColourPicker] = useState(false);

  useEffect(() => {
    const initialPointObjects = initialPoints.map(([x, y]) => ({
      position: new Vector3(x, y, 0),
    }));
    setPoints(initialPointObjects);
  }, [initialPoints]);

  const handleSave = () => {
    const pts: [number, number][] = points.map((p) => [
      p.position.x,
      p.position.y,
    ]);
    onSave(pts, displayColour);
  };

  const toggleColourPicker = () => {
    setShowColourPicker(!showColourPicker);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Shape</h2>
        <div className="canvas-container">
          <Canvas
            style={{ background: "#cccccc" }}
            ref={canvasRef}
            orthographic
            camera={{ zoom: 50, position: [0, 0, 100] }}
          >
            <OrbitControls enableRotate={false} />
            <PolygonEditor
              setPointsArray={setPoints}
              displayColour={displayColour}
              initialPoints={points}
            />
          </Canvas>
        </div>
        <div className="modal-actions">
          <button className="modal-button" onClick={handleSave}>
            Save
          </button>
          <button className="modal-button" onClick={onClose}>
            Cancel
          </button>
          <div className="colour-picker-container">
            <button className="modal-button" onClick={toggleColourPicker}>
              {showColourPicker ? "Hide Colour Picker" : "Show Colour Picker"}
            </button>
            {showColourPicker && (
              <div className="colour-picker-popup">
                <HexColorPicker
                  color={displayColour}
                  onChange={setDisplayColour}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPolygonModal;
