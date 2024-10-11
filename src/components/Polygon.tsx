import React, { useContext, useRef } from "react";
import * as THREE from "three";
import { IOUPolygon2DAction, PolygonData } from '../utils/types'
import { PolygonContext } from "../contexts/PolygonContext";
import { DragControls } from "@react-three/drei";
import BoundingBox2D from './BoundingBox2D'

type PolygonProps = PolygonData & { index: number; selectable: boolean } & { iouDispatch?: React.Dispatch<IOUPolygon2DAction> } & { polygons?: Map<string, PolygonData>; };

const Polygon = ({ id, position, geometry, colour, iouDispatch, opacity, selectable, generateId }: PolygonProps) => {
	const mesh = useRef<THREE.Mesh>(null!);
	const { dispatch, selectedPolygonID, currentlyMousedOverPolygons, selectability, polygons } = useContext(PolygonContext)!;
	const originalPosition = useRef<[number, number]>([0, 0]);
	const matrix = new THREE.Matrix4();

	const selectPolygon = () => {
		if (!selectability || !selectable) return;
		if ((selectedPolygonID === null || Math.max(...currentlyMousedOverPolygons) === id) && dispatch) {
			// only select the largest polygon index
			dispatch({ type: "SELECT_POLYGON", id: id });
		}
	};

	const isPolygonSelected = () => {
		return selectedPolygonID === id;
	};

	/**********************************/
	const handleDragEnd = () => {
		/* Could trigger updates to IoU or something here maybe */
		if (iouDispatch) {
			iouDispatch({ type: "RECALCULATE_CHILD_IOUS_USING_ID", payload: { id: id, polygons: polygons } })
		}
	};

	const handleDragStart = () => {
		if (!isPolygonSelected()) {
			selectPolygon();
		}
		if (mesh.current) {
			const v = new THREE.Vector3();
			mesh.current.getWorldPosition(v)
			originalPosition.current = v.toArray().slice(0, 2) as [number, number];
			if (iouDispatch) {
				iouDispatch({ type: "HIDE_CHILD_IOUS_USING_ID", payload: id })
			}
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
					id: id,
					position: new_pos,
				});
			}
		}
	};
	/**********************************/

	return (
		<>
			<DragControls
				matrix={matrix}
				autoTransform={false}
				onDragStart={handleDragStart}
				onDrag={(localMatrix) => { handleDrag(localMatrix) }}
				onDragEnd={handleDragEnd}
			>
				<mesh
					position={[position[0], position[1], 0]}
					geometry={geometry}
					ref={mesh}
					onPointerEnter={() => {
						if (dispatch)
							dispatch({ type: "ADD_MOUSED_OVER_POLYGON", id: id });
					}}
					onPointerLeave={() => {
						if (dispatch)
							dispatch({ type: "REMOVE_MOUSED_OVER_POLYGON", id: id });
					}}
					onClick={selectPolygon}
				>
					<meshBasicMaterial
						color={colour}
						transparent={true}
						opacity={opacity}
						side={THREE.DoubleSide}
					/>
				</mesh>

			</DragControls>
			<BoundingBox2D
				id={id}
				position={position}
				geometry={geometry}
				mesh={mesh}
				iouDispatch={iouDispatch}
        generateId={generateId}
			/>

		</>
	);
};

export default Polygon;
