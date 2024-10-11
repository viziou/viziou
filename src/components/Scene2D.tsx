import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Scene2DProps } from "../utils/types";
import Polygon from "./Polygon";
import { useContext } from "react";
import { PolygonContext } from "../contexts/PolygonContext";
import IOUPolygon from './IOUPolygon.tsx'

const Scene2D = ({ polygons, iouPolygons, iouDispatch, generateId }: Scene2DProps) => {
	const { dispatch, currentlyMousedOverPolygons } = useContext(PolygonContext)!;

	const handleCanvasClick = () => {
		// if no polygons are moused over when clicking, deselect polygon if one is selected
		if (dispatch) {
			if (currentlyMousedOverPolygons.length === 0) {
				dispatch({ type: "SELECT_POLYGON", id: null });
			}
		}
	};
	return (
		<Canvas
			style={{ height: "100vh", width: "100vw", background: "#cccccc" }}
			onPointerMissed={handleCanvasClick}
		>
			{Array.from(polygons.values()).map((polygon, index) => (
				<Polygon
					id={polygon.id}
					key={index}
					index={index}
					position={polygon.position}
					geometry={polygon.geometry}
					colour={polygon.colour}
					iouDispatch={iouDispatch}
					opacity={polygon.opacity}
					selectable={true}
					polygons={polygons}
          generateId={generateId}
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
					parentIDa={polygon.parentIDa}
					parentIDb={polygon.parentIDb}
				  generateId={generateId}
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
