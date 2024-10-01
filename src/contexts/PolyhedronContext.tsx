import { createContext, useReducer, ReactNode } from 'react';
import { PolyhedronData, Polyhedron3DAction, ConfirmationModalInfo } from '../utils/types';
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

const initialState: PolyhedronContextInterface = {
    polyhedra: new Map<string, PolyhedronData>,
    selectedPolyhedronID: null,
    confirmationInfo: defaultConfirmationInfo,
    displayWarnings: false
};

interface PolyhedronContextInterface {
    polyhedra: Map<string, PolyhedronData>;
    selectedPolyhedronID: number | null;
    dispatch?: React.Dispatch<Polyhedron3DAction>;
    confirmationInfo: ConfirmationModalInfo;
    displayWarnings: boolean
}

export const PolyhedronContext = createContext<PolyhedronContextInterface | undefined>(undefined);

export function key(polyhedron: PolyhedronData) {
  return `${polyhedron.id}`
}

function PolyhedronReducer(state: PolyhedronContextInterface, action: Polyhedron3DAction) {
    switch (action.type) {
        case "ADD_CUBE":
            return {
                ...state,
                polyhedra: state.polyhedra.set(key(action.payload), action.payload),
            };

        case "ADD_RANDOM_POLYHEDRON":
            return {
                ...state,
                polyhedra: state.polyhedra.set(key(action.payload), action.payload),
            };

        case "SET_POLYHEDRONS":
            state.polyhedra.clear();
            for (const polyhedron of action.payload) {
              state.polyhedra.set(key(polyhedron), polyhedron);
            }
            return {
              ...state,
              polyhedra: state.polyhedra
            };

      case "CLEAR_POLYHEDRA":
            return {
                ...state,
                polyhedra: new Map<string, PolyhedronData>,
            };

        case "UPDATE_POLYHEDRON":
            const updatedPolyhedra = state.polyhedra.get(`${action.id}`);
            if (updatedPolyhedra) {
              updatedPolyhedra.position = action.position;
              updatedPolyhedra.rotation = action.rotation;
              updatedPolyhedra.scale = action.scale;
            }

            return {
                ...state,
                polyhedra: state.polyhedra,
            };

        case "DELETE_POLYHEDRON":
            return {
                ...state,
                polyhedra: state.polyhedra.delete(`${action.id}`),
                selectedPolyhedronID: null
            };

        case "SELECT_POLYHEDRON":
            return {
                ...state,
                selectedPolyhedronID: action.id
            };

        case "DUPLICATE_POLYHEDRON":
            console.log("DISPATCHING DUPLICATE")
            const polyhedron = state.polyhedra.get(`${action.id}`);
            if (polyhedron) {
                const duplicatePolyhedron: PolyhedronData = {
                    position: [
                        polyhedron.position[0],
                        polyhedron.position[1],
                        polyhedron.position[2],
                    ],
                    geometry: polyhedron.geometry.clone(),
                    scale: [
                        polyhedron.scale[0],
                        polyhedron.scale[1],
                        polyhedron.scale[2],
                    ],
                    rotation: [
                        polyhedron.rotation[0],
                        polyhedron.rotation[1],
                        polyhedron.rotation[2],
                    ],
                    colour: polyhedron.colour.slice(),
                    id: action.newId,
                    opacity: 0.5,
                };

                // Get bbox to figure out optimal placement of clone
                duplicatePolyhedron.geometry.computeBoundingBox();
                const box = duplicatePolyhedron.geometry.boundingBox;
                if (box) {
                    const size = box.getSize(new THREE.Vector3());
                    duplicatePolyhedron.position[0] += size.x / 2;
                    duplicatePolyhedron.position[1] -= size.y / 2;
                    duplicatePolyhedron.position[2] += size.z / 2;
                }
                state.polyhedra.set(key(duplicatePolyhedron), duplicatePolyhedron)
            }
            return {
                ...state,
                polyhedra: state.polyhedra,
                selectedPolyhedronID: action.newId,
            };

        case "STORE_TRANSFORMED_VERTICES":
            const updatedPolyhedraWithVertices = state.polyhedra.get(`${action.id}`);

            if (updatedPolyhedraWithVertices) {
              updatedPolyhedraWithVertices.transformedVertices = action.transformedVertices;
            }
            return {...state}

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

        case "SET_DISPLAY_WARNINGS":
            return {
                ...state,
                displayWarnings: action.display
            }

        default:
            return state;
    }
}

interface PolyhedronProviderProps {
    children: ReactNode;
}

export function PolyhedronProvider(props: PolyhedronProviderProps) {
    const [state, dispatch] = useReducer(PolyhedronReducer, initialState);

    return (
        <PolyhedronContext.Provider value={{ polyhedra: state.polyhedra, dispatch, confirmationInfo: state.confirmationInfo, selectedPolyhedronID: state.selectedPolyhedronID, displayWarnings: state.displayWarnings }}>
            {props.children}
        </PolyhedronContext.Provider>
    );
}
