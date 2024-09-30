import { useContext, useState, useRef } from "react";
import * as THREE from "three";
import { ConvexGeometry } from "../backend/Interface";

import Scene2D from "../components/Scene2D";
import { IOUPolygonData, PolygonData } from "../utils/types";
import { PolygonContext } from "../contexts/PolygonContext";
import "../styles/TwoDEnv.css";
import Sidebar2D from '../components/Sidebar2D';

import { Backend2D, Storage } from "../backend/Interface";
import AddPolygonModal from "../modals/AddPolygonModal";

import { generatePairs } from "../utils/Generic";
import EditPolygonModal from "../modals/EditPolygonModal";
import { IOUPolygonContext } from '../contexts/IOUPolygonContext.tsx'

const TwoDEnv = () => {
    const context = useContext(PolygonContext);
    const IoUcontext = useContext(IOUPolygonContext);

    const nonceGenerator = useRef(0);

    const generateId = () => {
        nonceGenerator.current += 1;
        return nonceGenerator.current;
    };

    if (!context?.dispatch || !IoUcontext?.dispatch) {
        throw new Error("TwoDEnv must be used within a PolygonProvider");
    }

    const { polygons, dispatch, selectedPolygonID, editingShape } = context;
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

  const clearPolygons = () => {
      console.log("Dispatching CLEAR_POLYGONS");
      dispatch({ type: "CLEAR_POLYGONS" });
      iouDispatch({ type: "CLEAR_POLYGONS" }); // clear IoUs as well
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
        <Sidebar
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
            // temp initial state for now:
            initialPoints={[
              [0, 0],
              [0, 1],
              [1, 0],
              [1, 1],
            ]}
            initialColour={"green"}
          />
          ) : null}

          <main className="twod-canvas-container">
              <Scene2D polygons={polygons} iouPolygons={iouPolygons} iouDispatch={iouDispatch} />
          </main>
      </div>
  );
};

export default TwoDEnv;
