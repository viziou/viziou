import { Html } from "@react-three/drei";
import { Vector3 } from "three";

interface InfographicProps {
  position: Vector3;
  info: Record<string, number | string>;
}

const Infographic = ({ position, info }: InfographicProps) => {
  return (
    <Html position={position}>
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          color: "black",
          padding: "10px",
          borderRadius: "8px",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          width: "auto",
          minWidth: "150px",
        }}
      >
        {Object.entries(info).map(([key, value]) => (
          <p key={key} style={{ margin: "5px 0" }}>
            <strong>{key}:</strong>{" "}
            {typeof value === "number" ? value.toFixed(2) : value}
          </p>
        ))}
      </div>
    </Html>
  );
};

export default Infographic;
