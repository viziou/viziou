import { createContext, useReducer, ReactNode } from "react";
import { PolygonData, Polygon2DAction } from "../utils/types";
import * as THREE from "three";

const initialState: PolygonContextInterface = {
  polygons: new Map<string, PolygonData>,
  selectedPolygonIndex: null,
  currentlyMousedOverPolygons: [],
  editingShape: null,
  selectability: true,
  currentDecimalPlaces: 2,
};

interface PolygonContextInterface {
  polygons: Map<string, PolygonData>;
  dispatch?: React.Dispatch<Polygon2DAction>;
  selectedPolygonIndex: number | null;
  currentlyMousedOverPolygons: number[];
  editingShape: number | null;
  selectability: boolean;
  currentDecimalPlaces: number;
}

export const PolygonContext = createContext<
  PolygonContextInterface | undefined
>(undefined);

export function key(polygon: PolygonData): string {
  // The key that uniquely indexes a polygon. This key can be more sophisticated if required.
  return `${polygon.id}`;
}

function PolygonReducer(
  state: PolygonContextInterface,
  action: Polygon2DAction
) {
  switch (action.type) {
    case "ADD_SQUARE":
      return {
        ...state,
        polygons: state.polygons.set(key(action.payload), action.payload),
      };

        case "ADD_RANDOM_POLYGON":
            return {
              ...state,
              polygons: state.polygons.set(key(action.payload), action.payload),
            };

      case "ADD_POINT":
            return {
              ...state,
              polygons: state.polygons.set(key(action.payload), action.payload),
      };

        case "SET_POLYGONS":
                state.polygons.clear();
                for (const polygon of action.payload) {
                  state.polygons.set(key(polygon), polygon);
                }
            return {
                ...state,
                polygons: state.polygons,
      };

    case "CLEAR_POLYGONS":
      return {
        ...state,
        polygons: new Map<string, PolygonData>,
      };

    case "UPDATE_POSITION":
        const updatedPolygon = state.polygons.get(`${action.id}`);
        if (updatedPolygon) {
          updatedPolygon.position = action.position;
          state.polygons.set(key(updatedPolygon), updatedPolygon);
        }
        return {
            ...state,
            polygons: state.polygons,
        }

    case "SELECT_POLYGON":
      // Take the polygon out and move it to the back
      // let splicedPolygons = [...state.polygons];
      // console.log(action.index);
      // console.log({splicedPolygons});
      // if (action.index) {
      //   const selectedPolygon = splicedPolygons[action.index];
      //   splicedPolygons.splice(action.index, 1);
      //   splicedPolygons.push(selectedPolygon)
      //   console.log({splicedPolygons});
      //   action.index = splicedPolygons.length - 1;
      // }
      // console.log(action.index);
      return {
        ...state,
        // polygons: splicedPolygons,
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
        selectedPolygonIndex: currentPolygons.length - 1,
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

    case "SELECTABILITY":
      return {
        ...state,
        selectability: action.payload,
      };

    case "SET_DECIMAL_PRECISION":
      return {
        ...state,
        currentDecimalPlaces: action.precision,
      }

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
        selectability: state.selectability,
        currentDecimalPlaces: state.currentDecimalPlaces
      }}
    >
      {props.children}
    </PolygonContext.Provider>
  );
}
