import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Scene2DProps } from "../utils/types";
import Polygon from "./Polygon";
import IOUPolygon from './IOUPolygon.tsx'

const Scene2D = ({ polygons, iouPolygons, iouDispatch }: Scene2DProps) => {
  return (
    <Canvas style={{ height: "80vh", background: "#cccccc" }}>
      {polygons.map((polygon, index) => (
        <Polygon
          id={polygon.id}
          key={index}
          index={index}
          position={polygon.position}
          geometry={polygon.geometry}
          colour={polygon.colour}
          iouDispatch={iouDispatch}
          opacity={polygon.opacity}
        />
      ))}
      {Array.from(iouPolygons.values()).map((polygon, index) => (
        <IOUPolygon id={polygon.id}
          key={index}
          index={index}
          position={polygon.position}
          geometry={polygon.geometry}
          colour={polygon.colour}
          opacity={polygon.opacity}
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
