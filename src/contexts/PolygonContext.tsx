import { createContext, useReducer, ReactNode } from "react";
import { PolygonData, Polygon2DAction, ConfirmationModalInfo } from "../utils/types";
import * as THREE from "three";

const defaultConfirmationInfo = {
  isOpen: false,
  onClose: () => {},
  onConfirm: () => {},
  message: "",
  description: "",
  confirmText: "",
  cancelText: ""
}

const initialState: PolygonContextInterface = {
  polygons: new Map<string, PolygonData>,
  selectedPolygonID: null,
  currentlyMousedOverPolygons: [],
  editingShape: null,
  selectability: true,
  currentDecimalPlaces: 2,
  confirmationInfo: defaultConfirmationInfo
};

interface PolygonContextInterface {
  polygons: Map<string, PolygonData>;
  dispatch?: React.Dispatch<Polygon2DAction>;
  selectedPolygonID: number | null;
  currentlyMousedOverPolygons: number[];
  editingShape: number | null;
  selectability: boolean;
  currentDecimalPlaces: number;
  confirmationInfo: ConfirmationModalInfo;
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
        selectedPolygonID: action.id
      };

    case "DELETE_POLYGON":
      // TODO: You can actually delete using the entire Polygon object which is technically safer
      // const remainingPolygons = [...state.polygons];
      // remainingPolygons.splice(action.index, 1);
      state.polygons.delete(`${action.id}`);
      return {
        ...state,
        polygons: state.polygons,
      };

    case "DUPLICATE_POLYGON": {
      const polygon = state.polygons.get(`${action.id}`);
      if (polygon) {
        const duplicatePolygon: PolygonData = {
          id: action.newId,
          position: [
            polygon.position[0],
            polygon.position[1]
          ],
          geometry: polygon.geometry.clone(),
          colour: polygon.colour.slice(),
          opacity: 1
        };

        // Get bbox to figure out optimal placement of clone
        duplicatePolygon.geometry.computeBoundingBox();
        const box = duplicatePolygon.geometry.boundingBox;
        if (box) {
          const size = box.getSize(new THREE.Vector3());
          duplicatePolygon.position[0] += size.x / 2;
          duplicatePolygon.position[1] -= size.y / 2;
          state.polygons.set(key(duplicatePolygon), duplicatePolygon);
        }
      }
      return {
        ...state,
        polygons: state.polygons,
        selectedPolygonID: action.newId,
      };
    }

    case "ADD_MOUSED_OVER_POLYGON":
      const mousedOver = state.currentlyMousedOverPolygons.slice();
      if (!mousedOver.includes(action.id)) {
        mousedOver.push(action.id);
      }
      return {
        ...state,
        currentlyMousedOverPolygons: mousedOver.slice(),
      };

    case "REMOVE_MOUSED_OVER_POLYGON":
      const mousedOverArr = state.currentlyMousedOverPolygons.slice();
      if (mousedOverArr.includes(action.id)) {
        const index = mousedOverArr.indexOf(action.id);
        if (index > -1) {
          mousedOverArr.splice(index, 1);
        }
      }
      return {
        ...state,
        currentlyMousedOverPolygons: mousedOverArr.slice(),
      };

    case "UPDATE_GEOMETRY": {
      const polygon = state.polygons.get(`${action.id}`);
      if (polygon) {
        polygon.geometry = action.geometry;
        polygon.position = action.position || polygon.position;
      }
      return {
        ...state,
        polygons: state.polygons
      };
    }
      // return {
      //   ...state,
      //   polygons: state.polygons.map((polygon, i) =>
      //     i === action.index
      //       ? {
      //           ...polygon,
      //           geometry: action.geometry,
      //           position: action.position || polygon.position,
      //         }
      //       : polygon
      //   ),
      // };

    case "SET_EDIT":
      return {
        ...state,
        editingShape: action.id,
      };

    case "EDIT_POLYGON":
      const polygon = state.polygons.get(`${action.id}`);
      if (polygon) {
        polygon.geometry = action.geometry;
        polygon.colour = action.colour;
      }
      return {
        ...state,
        polygons: state.polygons
      };
      // return {
      //   ...state,
      //   polygons: state.polygons.map((polygon, i) =>
      //     i === action.index
      //       ? {
      //           ...polygon,
      //           geometry: action.geometry,
      //           colour: action.colour,
      //         }
      //       : polygon
      //   ),
      //}

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

    case "OPEN_CONFIRMATION_MODAL":
      return {
        ...state,
        confirmationInfo: action.info
      }

    case "CLOSE_CONFIRMATION_MODAL":
      return {
        ...state,
        confirmationInfo: defaultConfirmationInfo
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
        selectedPolygonID: state.selectedPolygonID,
        currentlyMousedOverPolygons: state.currentlyMousedOverPolygons,
        editingShape: state.editingShape,
        selectability: state.selectability,
        currentDecimalPlaces: state.currentDecimalPlaces,
        confirmationInfo: state.confirmationInfo
      }}
    >
      {props.children}
    </PolygonContext.Provider>
  );
}
