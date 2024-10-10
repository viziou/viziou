import { useContext, useState, useEffect } from "react";
import * as THREE from "three";
import { BoundingBoxProps } from '../utils/types'
import { PolygonContext } from "../contexts/PolygonContext";
import { useThree } from "@react-three/fiber";
import edit from '../assets/new_edit.png';
import bin from '../assets/new_bin.png';
import duplicate from '../assets/new_duplicate.png';
import { Line } from "@react-three/drei";

// Load texture icons
const editIconTexture = new THREE.TextureLoader().load(edit);
const deleteIconTexture = new THREE.TextureLoader().load(bin);
const duplicateIconTexture = new THREE.TextureLoader().load(duplicate);

const BoundingBox2D = ({ id, position, geometry, mesh, iouDispatch }: BoundingBoxProps) => {
	const { dispatch, selectedPolygonID, polygons } = useContext(PolygonContext)!;
	const { scene, camera, pointer } = useThree();
	const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null);
	const [initialBBox, setInitialBBox] = useState<THREE.Box3 | null>(null);
	const [mousePointer, setMousePointer] = useState<string | null>(null);
	const [resizing, setResizing] = useState(false);
	const [corner, setCorner] = useState<string | null>(null);
	const [rotating, setRotating] = useState(false);
	const [orientation, setOrientation] = useState(0);

	useEffect(() => {
		if (mesh.current) {
			const box = new THREE.Box3().setFromObject(mesh.current);
			setBoundingBox(box);
		}
	}, [geometry, position, scene]);

	useEffect(() => {
		document.body.style.cursor =
			mousePointer === "nesw"
				? `nesw-resize`
				: mousePointer === "nwse"
					? "nwse-resize"
					: mousePointer === "move"
						? "move"
						: mousePointer === "pointer"
							? "pointer"
							: "auto";
	}, [mousePointer]);

	const isPolygonSelected = () => {
		return selectedPolygonID === id;
	};

	const getCanvasMousePosition = () => {
		const vec = new THREE.Vector3(); // create once and reuse
		const pos = new THREE.Vector3(); // create once and reuse
		vec.set(
			pointer.x,
			pointer.y,
			0.5,
		);
		vec.unproject(camera as THREE.OrthographicCamera);
		vec.sub(camera.position).normalize();
		const distance = -camera.position.z / vec.z;
		pos.copy(camera.position).add(vec.multiplyScalar(distance));
		return pos
	};

	const handleResizeStart = (corner: string) => {
		setResizing(true);
		setCorner(corner);
		if (dispatch)
			dispatch({ type: "SELECTABILITY", payload: false });
		if (iouDispatch) {
			iouDispatch({ type: "HIDE_CHILD_IOUS_USING_ID", payload: id })
		}
	};

	const handleResizeDrag = () => {
		if (!resizing || !boundingBox || !corner)
			return;

		// Obtain bounding box size and center
		const size = boundingBox.getSize(new THREE.Vector3());
		const center = boundingBox.getCenter(new THREE.Vector3());

		// Get mouse position relative to the box center
		const mousePosition = getCanvasMousePosition().sub(center);

		// Set corner based on where mousePosition is
		if (mousePosition.x > 0 && mousePosition.y > 0) {
			setCorner("topRight")
		} else if (mousePosition.x < 0 && mousePosition.y > 0) {
			setCorner("topLeft")
		} else if (mousePosition.x < 0 && mousePosition.y < 0) {
			setCorner("bottomLeft")
		} else if (mousePosition.x > 0 && mousePosition.y < 0) {
			setCorner("bottomRight")
		}

		// Initialise corner position
		let cornerPosition = new THREE.Vector3(0, 0, 0);

		// Calculate the corner position relative to the box center
		switch (corner) {
			case "topLeft":
				cornerPosition = size.divideScalar(2);
				cornerPosition.x *= -1;
				break;

			case "topRight":
				cornerPosition = size.divideScalar(2);
				break;

			case "bottomLeft":
				cornerPosition = size.divideScalar(2).multiplyScalar(-1);
				break;

			case "bottomRight":
				cornerPosition = size.divideScalar(2);
				cornerPosition.y *= -1;
				break;
		}

		// Calculate the multiplier needed to bring the corner box to the current mouse position
		if (cornerPosition.x != 0 && cornerPosition.y != 0 && mousePosition.x != 0 && mousePosition.y != 0) {
			const scaleX = mousePosition.x / cornerPosition.x;
			const scaleY = mousePosition.y / cornerPosition.y;

			// Create the translations to anchor all scaling to opposite corner
			// const translationX = center.x - position[0] - cornerPosition.x;
			// const translationY = center.y - position[1] - cornerPosition.y;
			const translationX = center.x - position[0];
			const translationY = center.y - position[1];

			// Translate from position to bbox center
			const newGeometry = geometry.clone();
			newGeometry.translate(-translationX, -translationY, 0);
			newGeometry.scale(scaleX, scaleY, 1);
			newGeometry.translate(translationX, translationY, 0);

			if (dispatch) {
				dispatch({
					type: "UPDATE_GEOMETRY",
					geometry: newGeometry,
					id: id,
				});
			}
		}
	};

	const handleResizeEnd = () => {
		setResizing(false);
		setCorner(null);
		if (iouDispatch) {
			iouDispatch({ type: "RECALCULATE_CHILD_IOUS_USING_ID", payload: { id: id, polygons: polygons } })
		}
	};
	/**********************************/

	/**********************************/
	const handleRotateStart = () => {
		setRotating(true);
		setOrientation(0);
		if (dispatch) {
			dispatch({ type: "SELECTABILITY", payload: false });
		}
		if (iouDispatch) {
			iouDispatch({ type: "HIDE_CHILD_IOUS_USING_ID", payload: id })
		}
		setInitialBBox(boundingBox);
	};

	const handleRotateDrag = () => {
		if (!rotating || !initialBBox)
			return;
		setMousePointer("move")

		// Obtain bounding box center
		const center = initialBBox.getCenter(new THREE.Vector3());

		// Get mouse position relative to the box center
		const mousePosition = getCanvasMousePosition().sub(center);

		// Calculate angle of new orientation w.r.t the vertical
		const vertical = new THREE.Vector3(0, 1, 0);
		let newOrientation = mousePosition.angleTo(vertical);
		if (mousePosition.cross(vertical).z > 0) {
			newOrientation *= -1;
		}

		// Calculate the angle to rotate
		const angleDiff = newOrientation - orientation;

		// Apply rotation to geometry
		const newGeometry = geometry.clone()
		const translationX = center.x - position[0];
		const translationY = center.y - position[1];
		newGeometry.translate(-translationX, -translationY, 0);
		newGeometry.rotateZ(angleDiff);
		newGeometry.translate(translationX, translationY, 0);

		if (dispatch) {
			dispatch({
				type: "UPDATE_GEOMETRY",
				geometry: newGeometry,
				id: id,
			});
		}
		setOrientation(newOrientation);
	};

	const handleRotateEnd = () => {
		setRotating(false);
		setOrientation(0);
		setInitialBBox(null);
		setMousePointer(null);
		if (dispatch) {
			dispatch({ type: "SELECTABILITY", payload: true });
		}
		if (iouDispatch) {
			iouDispatch({ type: "RECALCULATE_CHILD_IOUS_USING_ID", payload: { id: id, polygons: polygons } })
		}
	};
	/**********************************/

	const deleteSelectedPolygon = () => {
		document.body.style.cursor = "auto";
		if (dispatch) {
			dispatch({ type: "DELETE_POLYGON", id: id })
			dispatch({ type: "SELECT_POLYGON", id: null });
      if (iouDispatch) {
        iouDispatch({type: "DELETE_CHILD_IOUS_USING_ID", payload: id })
      }
		}
	}

	const duplicateSelectedPolygon = () => {
		if (dispatch) {
			// TODO: pass down a reference to the nonce generator. THIS MUST BE FIXED BEFORE PRODUCTION
			dispatch({ type: "DUPLICATE_POLYGON", id: id, newId: id * 100000 })
		}
	}

	const editSelectedPolygon = () => {
		if (dispatch) {
			dispatch({ type: "SET_EDIT", id: id })
		}
	}

	if (!boundingBox || !isPolygonSelected())
		return <></>;

	const size = boundingBox.getSize(new THREE.Vector3());
	const center = boundingBox.getCenter(new THREE.Vector3());

	return (
		<group position={center}>
			{/* Invisible large box to allow dragging when the drag points aren't moused over: */}
			{resizing || rotating ? (
				<mesh
					key={"invisible"}
					visible={false}
					onPointerMove={(_) => {
						if (resizing) handleResizeDrag();
						if (rotating) handleRotateDrag();
					}}
					onPointerUp={(_) => {
						if (resizing) handleResizeEnd()
						if (rotating) handleRotateEnd();
					}}
					onPointerLeave={(_) => {
						if (resizing) handleResizeEnd();
						if (rotating) handleRotateEnd();
					}}
				>
					<boxGeometry args={[size.x * 100 + 10, size.y * 100 + 10, 0]} />
				</mesh>
			) : null}

			{/* Red Lines to show bounding box: */}
			{!rotating && !resizing ? (
				<Line
					points={[
						[-size.x / 2, -size.y / 2, 0],
						[size.x / 2, -size.y / 2, 0],
						[size.x / 2, size.y / 2, 0],
						[-size.x / 2, size.y / 2, 0],
						[-size.x / 2, -size.y / 2, 0],
					]}
					color={"red"}
					transparent={true}
				/>
			) : null}

			{/* Boxes on each corner: */}
			{!rotating ? ["topLeft", "topRight", "bottomLeft", "bottomRight"].map(
				(corner, i) => (
					<mesh
						key={corner}
						position={[
							((i % 2 === 0 ? -1 : 1) * size.x) / 2,
							((i < 2 ? 1 : -1) * size.y) / 2,
							0,
						]}
						onPointerDown={(_) => {
							handleResizeStart(corner);
						}}
						onPointerEnter={() => {
							setMousePointer(
								corner === "topRight" || corner === "bottomLeft"
									? "nesw"
									: "nwse"
							);
							if (dispatch && !rotating)
								dispatch({ type: "SELECTABILITY", payload: false });
						}}
						onPointerLeave={() => {
							setMousePointer(null);
							if (dispatch && !rotating)
								dispatch({ type: "SELECTABILITY", payload: true });
						}}
						renderOrder={1}
					>
						<boxGeometry args={[0.2, 0.2, 0]} />
						<meshBasicMaterial color="blue" side={THREE.DoubleSide} transparent={true}/>
					</mesh>
				)
			) : null}

			{/* Rotate circle: */}
			{!rotating && !resizing ? <mesh
				position={[0, size.y / 2 + 0.5, 0]}
				onPointerDown={handleRotateStart}
				onPointerEnter={() => setMousePointer("move")}
				onPointerUp={() => setMousePointer(null)}
				onPointerLeave={() => setMousePointer(null)}
			>
				<circleGeometry args={[0.1, 16]} />
				<meshBasicMaterial color="green" side={THREE.DoubleSide} transparent={true} />
			</mesh> : null}

			{/* Line to Rotate circle: */}
			{!resizing && !rotating ? (
				<Line
				points={[
					[0, size.y / 2, 0],
					[0, size.y / 2 + 0.5 - 0.1, 0]
				]}
				color={"red"}
				transparent={true}
			/>
			) : null}

			{/* Edit button */}
			{!resizing && !rotating ? (
				<sprite
					position={[0.5, size.y / 2 + 0.5, 0]}
					onClick={editSelectedPolygon}
					onPointerEnter={() => {
						setMousePointer("pointer");
						if (dispatch)
							dispatch({ type: "SELECTABILITY", payload: false });
					}}
					onPointerLeave={() => {
						setMousePointer(null);
						if (dispatch)
							dispatch({ type: "SELECTABILITY", payload: true });
					}}
					onPointerUp={() => setMousePointer(null)}
					scale={[0.4, 0.4, 0]}
				>
					<spriteMaterial map={editIconTexture} transparent={true} />
				</sprite>
			) : null}

			{/* Duplicate button */}
			{!resizing && !rotating ? (
				<sprite
					position={[1, size.y / 2 + 0.5, 0]}
					onClick={duplicateSelectedPolygon}
					onPointerEnter={() => setMousePointer("pointer")}
					onPointerLeave={() => setMousePointer(null)}
					onPointerUp={() => setMousePointer(null)}
					scale={[0.4, 0.4, 0]}
				>
					<spriteMaterial map={duplicateIconTexture} transparent={true} />
				</sprite>
			) : null}

			{/* Delete button */}
			{!resizing && !rotating ? (
				<sprite
					position={[1.5, size.y / 2 + 0.5, 0]}
					onClick={deleteSelectedPolygon}
					onPointerEnter={() => setMousePointer("pointer")}
					onPointerLeave={() => setMousePointer(null)}
					onPointerUp={() => setMousePointer(null)}
					scale={[0.4, 0.4, 0]}
				>
					<spriteMaterial map={deleteIconTexture} transparent={true} />
				</sprite>
			) : null}
		</group>
	);
};

export default BoundingBox2D;
