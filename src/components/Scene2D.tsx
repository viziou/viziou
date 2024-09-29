import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Scene2DProps } from "../utils/types";
import Polygon from "./Polygon";
import { useContext } from "react";
import { PolygonContext } from "../contexts/PolygonContext";

const Scene2D = ({ polygons }: Scene2DProps) => {
  const { dispatch, currentlyMousedOverPolygons } = useContext(PolygonContext)!;

  const handleCanvasClick = () => {
    // if no polygons are moused over when clicking, deselect polygon if one is selected
    if (dispatch) {
      if (currentlyMousedOverPolygons.length === 0) {
        dispatch({ type: "SELECT_POLYGON", index: null });
      }
    }
  };

  return (
    <Canvas
      style={{ height: "80vh", background: "#cccccc" }}
      onPointerMissed={handleCanvasClick}
    >
      {polygons.map((polygon, index) => (
        <Polygon
          key={index}
          index={index}
          position={polygon.position}
          geometry={polygon.geometry}
          colour={polygon.colour}
          selectable={true}
        />
      ))}

      <OrbitControls
        enableRotate={false}
        enablePan={true}
        enableZoom={true}
        enableDamping={false}
      />
    </Canvas>
  );
};

export default Scene2D;
