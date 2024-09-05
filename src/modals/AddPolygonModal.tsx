import { useState, useRef } from "react";
import { Canvas, useThree, ThreeEvent } from "@react-three/fiber";
import { Vector3, OrthographicCamera } from "three";
import { OrbitControls } from "@react-three/drei";
import "../styles/Modal.css";

interface AddPolygonProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (points: [number, number][]) => void;
}

interface Point {
  position: Vector3;
}

interface PolygonCreatorProps {
  setPointsArray: (p: Point[]) => void;
}

const PointsCreator = ({ setPointsArray }: PolygonCreatorProps) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);
  const { camera, gl } = useThree();

  // add a point at the position where the user clicked:
  const handleCanvasClick = (event: ThreeEvent<MouseEvent>) => {
    if (draggedPoint !== null) return;

    const pos = getWorldPosition(event);
    const newPoints = [...points, { position: pos }];

    // set points array in this component AND parent component
    setPoints(newPoints);
    setPointsArray(newPoints);
  };

  // set the index of the currently dragged shape:
  const handlePointDragStart = (
    event: ThreeEvent<MouseEvent>,
    index: number
  ) => {
    event.stopPropagation();
    setDraggedPoint(index);
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

    // set points array in this component AND parent component
    setPoints(newPoints);
    setPointsArray(newPoints);
  };

  const handleDragEnd = () => {
    setDraggedPoint(null);
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
      {points.map((point, index) => (
        <mesh
          key={index}
          position={point.position}
          onPointerDown={(e) => handlePointDragStart(e, index)}
        >
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))}
    </>
  );
};

const AddPolygonModal = ({ isOpen, onClose, onSubmit }: AddPolygonProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);

  const handleSubmit = (_: any) => {
    const pts: [number, number][] = points.map((p) => [
      p.position.x,
      p.position.y,
    ]);

    onSubmit(pts);
  };

  // if modal is not open, just don't display anything
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create Custom Shape</h2>
        <div className="canvas-container">
          <Canvas
            style={{ background: "#cccccc" }}
            ref={canvasRef}
            orthographic
            camera={{ zoom: 50, position: [0, 0, 100] }}
          >
            <OrbitControls enableRotate={false} />
            <PointsCreator setPointsArray={setPoints} />
          </Canvas>
        </div>
        <div className="modal-actions">
          <button className="modal-button" onClick={handleSubmit}>
            Submit
          </button>
          <button className="modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPolygonModal;
