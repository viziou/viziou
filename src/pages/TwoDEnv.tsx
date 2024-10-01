import { useContext, useState, useRef } from "react";
import * as THREE from "three";
import { ConvexGeometry } from "../backend/Interface";

import Scene2D from "../components/Scene2D";
import { IOUPolygonData, PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import "../styles/TwoDEnv.css";
import Sidebar2D from "../components/Sidebar2D";

import { Backend2D, Storage } from "../backend/Interface";
import AddPolygonModal from "../modals/AddPolygonModal";

import { generatePairs } from "../utils/Generic";
import EditPolygonModal from "../modals/EditPolygonModal";
import { IOUPolygonContext } from '../contexts/IOUPolygonContext.tsx'
import ConfirmationModal from "../modals/ConfirmationModal";

const getSquare = (): THREE.PlaneGeometry => {
  return new THREE.PlaneGeometry(1, 1);
};

const getRandomGeometry =
  (): THREE.BufferGeometry<THREE.NormalBufferAttributes> => {
    // random number of vertices between 5 and 12
    const numVertices = Math.floor(Math.random() * 8) + 5;
    const points = [];

    for (let i = 0; i < numVertices; i++) {
      points.push(
        new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 4 - 2, 0)
      );
    }
    return ConvexGeometry.fromPoints(points);
  };

// generate random hex colours
const getRandomColour = (): string => {
  const letters = "0123456789ABCDEF";
  let colour = "#";

  for (let i = 0; i < 6; i++) {
    colour += letters[Math.floor(Math.random() * 16)];
  }

  return colour;
};

const TwoDEnv = () => {
    const context = useContext(PolygonContext);
    const IoUcontext = useContext(IOUPolygonContext);

    const nonceGenerator = useRef(0);

  const generateId = () => {
      nonceGenerator.current += 1
      return nonceGenerator.current
    }

    if (!context?.dispatch || !IoUcontext?.dispatch) {
    throw new Error("TwoDEnv must be used within a PolygonProvider");
  }

  const { polygons, dispatch, selectedPolygonID, editingShape, confirmationInfo } = context;
    const { polygonMap: iouPolygons, dispatch: iouDispatch } = IoUcontext;


  const [isAddShapeModalOpen, setIsAddShapeModalOpen] = useState(false);

  const handleAddShapeModalOpen = () => setIsAddShapeModalOpen(true);
  const handleModalClose = () => setIsAddShapeModalOpen(false);

  const handleAddShapeModalSubmit = (
    points: [number, number][],
    colour: string
  ) => {
    console.log(points);
    if (points.length > 2) {
      const newPolygon: PolygonData = {
        geometry: ConvexGeometry.fromPoints(
          points.map((p) => new THREE.Vector3(p[0], p[1], 0))
        ),
        position: [0, 0],
        colour: colour,
        id: generateId(),
        opacity: 1,
      };
      dispatch({ type: "ADD_RANDOM_POLYGON", payload: newPolygon });
    }
    handleModalClose();
  };

  const addSquare = () => {
    const newPolygon: PolygonData = {
      geometry: getSquare(),
      position: [
        Math.random() * 4 - 2, // x coordinate
        Math.random() * 4 - 2, // y coordinate
      ],
      colour: getRandomColour(),
      id: generateId(),
      opacity: 1
    };

    console.log("Dispatching ADD_SQUARE:", newPolygon);
    dispatch({ type: "ADD_SQUARE", payload: newPolygon });
  };

  const addRandomPolygon = () => {
    const newPolygon: PolygonData = {
      geometry: getRandomGeometry(),
      position: [
        0, 0,
        //    Math.random() * 4 - 2, // x coordinate
        //    Math.random() * 4 - 2, // y coordinate
      ],
      colour: getRandomColour(),
      opacity: 1,
      id: generateId()
    };

    console.log("Dispatching ADD_RANDOM_POLYGON:", newPolygon);
    dispatch({ type: "ADD_RANDOM_POLYGON", payload: newPolygon });
    // const geometryPosition = newPolygon.geometry.getAttribute('position');
    // for (let i = 0, l = geometryPosition.count; i < l; i+=3 ) {
    //   const newPoint: PolygonData = {
    //     geometry: new THREE.CircleGeometry(0.02, 50),
    //     position: [geometryPosition.array[i], geometryPosition.array[i + 1]],
    //     colour: '#C81400'
    //   }
    //   console.log("Dispatching ADD_POINT:")
    //   //dispatch({ type: "ADD_POINT", payload: newPoint });
    // }
    // console.time("Calculating Area of Polygon");
    // console.log("Area of new random polygon: ", Backend2D.area(newPolygon));
    // console.timeEnd("Calculating Area of Polygon");
    // console.time("Calculating Centroid");
    // const { x, y } = Backend2D.centreOfMass(newPolygon);
    // console.log("Centroid: (", x, ", ", y, ")");
    // console.time("Calculating Centroid");
    // console.log("Reducing polygon...");
    // const result = Backend2D.reduceThreeGeometry(newPolygon);
    // console.log("reduced polygon: ", result);
    // for (const vertex of result.vertices) {
    //   const newPoint: PolygonData = {
    //     geometry: new THREE.CircleGeometry(0.02, 50),
    //     position: [vertex.x, vertex.y],
    //     colour: '#0dc800'
    //   }
    //   //dispatch({ type: "ADD_POINT", payload: newPoint })
    // }
  };

  const clearPolygons = () => {
    const onSubmit = () => {
      console.log("Dispatching CLEAR_POLYGONS");
      dispatch({ type: "CLEAR_POLYGONS" });
      iouDispatch({ type: "CLEAR_POLYGONS" }); // clear IoUs as well
      dispatch( {type: "CLOSE_CONFIRMATION_MODAL"})
    };

    console.log("Opening clear confirmation modal");
    dispatch({
      type: "OPEN_CONFIRMATION_MODAL",
      info: {
        isOpen: true,
        onClose: () => {dispatch( {type: "CLOSE_CONFIRMATION_MODAL"})},
        onConfirm: onSubmit,
        message: "Are you sure you want to clear the canvas?",
        description: "This action cannot be undone.",
      },
    });
  };
  
  const showIoUs = () => {
      const IoUs: IOUPolygonData[] = [];
      for (const [a, b] of generatePairs(Array.from(polygons.values()))) {
          const { area, shape } = Backend2D.IoU(a, b);
          console.log("IoU between " + a.id + " and " + b.id + ": " + area);
          console.log("IoU shape: ", shape);
          const IoUPolygon: IOUPolygonData = {
              parentIDa: a.id,
              parentIDb: b.id,
              geometry: shape,
              position: [0, 0],
              colour: '#ce206b',
              id: generateId(),
              opacity: 1.0,
          };
          IoUs.push(IoUPolygon);
      }
      for (const polygon of IoUs) {
          console.log("Dispatching IoU Polygon via SET_POLYGON...", polygon);
          iouDispatch({ type: 'SET_POLYGON', payload: polygon });
      }
  };

  const clearIoUs = () => {
    console.log("Clearing IoU polygons...");
    iouDispatch({ type: "CLEAR_POLYGONS" });
  }

  const savePolygons = () => {
      console.log("Saving canvas...");
      Storage.save2D(Array.from(polygons.values()), "export");
  };
  
  const loadPolygons = async () => {
      console.log("Opening file dialog...");
      const polygonData = await Storage.load2D();
      console.log(polygonData);
      if (polygonData) {
          console.log("Dispatching SET_POLYGONS");
          dispatch({ type: "SET_POLYGONS", payload: polygonData });
      }
  };

  return (
    <div className="TwoDEnv">
        <Sidebar2D
          polygons={Array.from(polygons.values())}
          addPolygon={handleAddShapeModalOpen}
          clearPolygons={clearPolygons}
          showIoUs={showIoUs}
          clearIoUs={clearIoUs}
          savePolygons={savePolygons}
          loadPolygons={loadPolygons}
        />
        <AddPolygonModal
          isOpen={isAddShapeModalOpen}
          onClose={handleModalClose}
          onSubmit={handleAddShapeModalSubmit}
        addRandomShape={() => { addRandomPolygon(); handleModalClose();}}
        addSquare={() => {addSquare(); handleModalClose();}}
        />
        {editingShape ? (
          <EditPolygonModal
            isOpen={editingShape !== null}
            onClose={() => {
              if (dispatch) dispatch({ type: "SET_EDIT", id: null });
            }}
            onSave={(newPoints, newColour) => {
              // todo: make a dispatch here
              console.log("Updated points:", newPoints);
              console.log("Updated color:", newColour);
              if (dispatch) {
                console.log(polygons);
                dispatch({
                  type: "EDIT_POLYGON",
                  geometry: ConvexGeometry.fromPoints(
                    newPoints.map((p) => new THREE.Vector3(p[0], p[1], 0))
                  ),
                  colour: newColour,
                  id: selectedPolygonID!,
                });
                console.log(polygons);
                dispatch({ type: "SET_EDIT", id: null });
              }
            }}
            initialPoints={Backend2D._threeGeometryToPolygon2D(polygons.get(`${selectedPolygonID}`)!.geometry).vertices.map(v => [v.x, v.y])}
            initialColour={polygons.get(`${selectedPolygonID}`)!.colour}
          />
          ) : null}

        <main className="twod-canvas-container">
            <Scene2D polygons={polygons} iouPolygons={iouPolygons} iouDispatch={iouDispatch} />
        </main>
        <ConfirmationModal
        isOpen={confirmationInfo.isOpen}
        message={confirmationInfo.message}
        description={confirmationInfo.description}
        onConfirm={confirmationInfo.onConfirm}
        onClose={confirmationInfo.onClose}
      />
    </div>
  );
};

export default TwoDEnv;
