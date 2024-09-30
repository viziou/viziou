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

interface AddPolygonProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (points: [number, number][], colour: string) => void;
  addSquare: () => void;
  addRandomShape: () => void;
}

interface Point {
  position: Vector3;
}

interface PolygonCreatorProps {
  setPointsArray: (p: Point[]) => void;
  displayColour: string;
}

const PointsCreator = ({
  setPointsArray,
  displayColour,
}: PolygonCreatorProps) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [geometry, setGeometry] =
    useState<BufferGeometry<NormalBufferAttributes> | null>(null);
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);
  const { camera, gl } = useThree();

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

  // set the index of the currently dragged shape:
  const handlePointDragStart = (
    event: ThreeEvent<MouseEvent>,
    index: number
  ) => {
    event.stopPropagation();
    setDraggedPoint(index);
    setHovered(true);
  };

  const handleDrag = (event: ThreeEvent<MouseEvent>) => {
    // check we didn't drag nothing:
    if (draggedPoint === null) return;

    // get new mouse position:
    const pos = getWorldPosition(event);

    // update the point at currently dragged vertex with new mouse position:
    const newPoints = points.map((point, i) =>
      i === draggedPoint ? { position: pos } : point
    );

    updatePoints(newPoints);
  };

  const handleDragEnd = () => {
    setDraggedPoint(null);
    setHovered(false);
  };

  // get the position of the mouse in terms of the 3JS coordinates
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
        {/* TODO: fix, currently the size of this plane defines the maximum location the user can place points */}
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
        ></Polygon>
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

const AddPolygonModal = ({ isOpen, onClose, onSubmit, addRandomShape, addSquare }: AddPolygonProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [showColourPicker, setShowColourPicker] = useState(false);
  const [displayColour, setDisplayColour] = useState<string>("green");

  const toggleColourPicker = () => {
    setShowColourPicker(!showColourPicker);
  };

  const handleSubmit = (_: any) => {
    const pts: [number, number][] = points.map((p) => [
      p.position.x,
      p.position.y,
    ]);

    onSubmit(pts, displayColour);
  };

  // if modal is not open, just don't display anything
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Shape</h2>
        <div className="canvas-container">
          <Canvas
            style={{ background: "#cccccc" }}
            ref={canvasRef}
            orthographic
            camera={{ zoom: 50, position: [0, 0, 100] }}
          >
            <OrbitControls enableRotate={false} />
            <PointsCreator
              setPointsArray={setPoints}
              displayColour={displayColour}
            />
          </Canvas>
        </div>
        <div className="modal-actions">
          <div className="modal-actions-left">
            <button className="modal-button" onClick={addSquare}>Add Square</button>
            <button className="modal-button" onClick={addRandomShape}>Add Random Polygon</button>
          </div>
          <div className="modal-actions-right">
            <button
              className="modal-button modal-button-green"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button className="modal-button modal-button-red" onClick={onClose}>
              Close
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
    </div>
  );
};

export default AddPolygonModal;
