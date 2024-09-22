import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Scene2DProps } from "../utils/types";
import Polygon from "./Polygon";

const Scene2D = ({ polygons }: Scene2DProps) => {
  return (
    <Canvas style={{ height: "100vh", width: "100%", background: "#cccccc" }}>

      {polygons.map((polygon, index) => (
        <Polygon
          key={index}
          index={index}
          position={polygon.position}
          geometry={polygon.geometry}
          colour={polygon.colour}
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
