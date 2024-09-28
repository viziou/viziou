import { createContext, useReducer, ReactNode } from "react";
import { PolygonData, Polygon2DAction } from "../utils/types";
import * as THREE from "three";

const initialState: PolygonContextInterface = {
  polygons: [],
  selectedPolygonIndex: null,
  currentlyMousedOverPolygons: [],
  editingShape: null,
};

interface PolygonContextInterface {
  polygons: PolygonData[];
  dispatch?: React.Dispatch<Polygon2DAction>;
  selectedPolygonIndex: number | null;
  currentlyMousedOverPolygons: number[];
  editingShape: number | null;
}

export const PolygonContext = createContext<
  PolygonContextInterface | undefined
>(undefined);

function PolygonReducer(
  state: PolygonContextInterface,
  action: Polygon2DAction
) {
  switch (action.type) {
    case "ADD_SQUARE":
      return {
        ...state,
        polygons: [...state.polygons, action.payload],
      };

    case "ADD_RANDOM_POLYGON":
      return {
        ...state,
        polygons: [...state.polygons, action.payload],
      };

    case "ADD_POINT":
      return {
        ...state,
        polygons: [...state.polygons, action.payload],
      };

    case "SET_POLYGONS":
      return {
        ...state,
        polygons: [...action.payload],
      };

    case "CLEAR_POLYGONS":
      return {
        ...state,
        polygons: [],
      };

    case "UPDATE_POSITION":
      const updatedPolygons = [...state.polygons];
      updatedPolygons[action.index].position = action.position;
      return {
        ...state,
        polygons: updatedPolygons,
      };

    case "SELECT_POLYGON":
      // Take the polygon out and move it to the back
      // let splicedPolygons = [...state.polygons];
      // if (action.index) {
      //   const selectedPolygon = splicedPolygons[action.index];
      //   splicedPolygons.splice(action.index, 1);
      //   splicedPolygons = [...state.polygons, selectedPolygon];
      // }
      return {
        ...state,
        selectedPolygonIndex: action.index,
      };

    case "DELETE_POLYGON":
      const remainingPolygons = [...state.polygons];
      remainingPolygons.splice(action.index, 1);
      return {
        ...state,
        polygons: remainingPolygons,
      };

    case "DUPLICATE_POLYGON":
      const currentPolygons = [...state.polygons];
      const duplicatePolygon: PolygonData = {
        position: [
          currentPolygons[action.index].position[0],
          currentPolygons[action.index].position[1],
        ],
        geometry: currentPolygons[action.index].geometry.clone(),
        colour: currentPolygons[action.index].colour.slice(),
      };

      // Get bbox to figure out optimal placement of clone
      duplicatePolygon.geometry.computeBoundingBox();
      const box = duplicatePolygon.geometry.boundingBox;
      if (box) {
        const size = box.getSize(new THREE.Vector3());
        duplicatePolygon.position[0] += size.x / 2;
        duplicatePolygon.position[1] -= size.y / 2;
        currentPolygons.push(duplicatePolygon);
      }

      return {
        ...state,
        polygons: currentPolygons,
      };

    case "ADD_MOUSED_OVER_POLYGON":
      const mousedOver = state.currentlyMousedOverPolygons.slice();
      if (!mousedOver.includes(action.index)) {
        mousedOver.push(action.index);
      }
      return {
        ...state,
        currentlyMousedOverPolygons: mousedOver.slice(),
      };

    case "REMOVE_MOUSED_OVER_POLYGON":
      const mousedOverArr = state.currentlyMousedOverPolygons.slice();
      if (mousedOverArr.includes(action.index)) {
        const index = mousedOverArr.indexOf(action.index);
        if (index > -1) {
          mousedOverArr.splice(index, 1);
        }
      }
      return {
        ...state,
        currentlyMousedOverPolygons: mousedOverArr.slice(),
      };

    case "UPDATE_GEOMETRY":
      return {
        ...state,
        polygons: state.polygons.map((polygon, i) =>
          i === action.index
            ? {
                ...polygon,
                geometry: action.geometry,
                position: action.position || polygon.position,
              }
            : polygon
        ),
      };

    case "SET_EDIT":
      return {
        ...state,
        editingShape: action.index,
      };

    case "EDIT_POLYGON":
      return {
        ...state,
        polygons: state.polygons.map((polygon, i) =>
          i === action.index
            ? {
                ...polygon,
                geometry: action.geometry,
                colour: action.colour,
              }
            : polygon
        ),
      };

    default:
      return state;
  }
}

interface PolygonProviderProps {
  children: ReactNode;
}

export function PolygonProvider(props: PolygonProviderProps) {
  const [state, dispatch] = useReducer(PolygonReducer, initialState);

  return (
    <PolygonContext.Provider
      value={{
        polygons: state.polygons,
        dispatch,
        selectedPolygonIndex: state.selectedPolygonIndex,
        currentlyMousedOverPolygons: state.currentlyMousedOverPolygons,
        editingShape: state.editingShape,
      }}
    >
      {props.children}
    </PolygonContext.Provider>
  );
}
