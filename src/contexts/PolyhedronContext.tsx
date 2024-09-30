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
    polyhedra: [],
    selectedPolyhedronID: null,
    confirmationInfo: defaultConfirmationInfo,
    displayWarnings: false
};

interface PolyhedronContextInterface {
    polyhedra: PolyhedronData[];
    selectedPolyhedronID: number | null;
    dispatch?: React.Dispatch<Polyhedron3DAction>;
    confirmationInfo: ConfirmationModalInfo;
    displayWarnings: boolean
}

export const PolyhedronContext = createContext<PolyhedronContextInterface | undefined>(undefined);

function PolyhedronReducer(state: PolyhedronContextInterface, action: Polyhedron3DAction) {
    switch (action.type) {
        case "ADD_CUBE":
            return {
                ...state,
                polyhedra: [...state.polyhedra, action.payload],
            };

        case "ADD_RANDOM_POLYHEDRON":
            return {
                ...state,
                polyhedra: [...state.polyhedra, action.payload],
            };

        case "SET_POLYHEDRONS":
            return {
              ...state,
              polyhedra: [...action.payload]
            };

        case "CLEAR_POLYHEDRA":
            return {
                ...state,
                polyhedra: [],
            };

        case "UPDATE_POLYHEDRON":
            const updatedPolyhedra = [...state.polyhedra];
            
            updatedPolyhedra[action.index] = {
                ...updatedPolyhedra[action.index],
                position: action.position,  
                rotation: action.rotation,  
                scale: action.scale,       
            };

            return {
                ...state,
                polyhedra: updatedPolyhedra, 
            };

        case "DELETE_POLYHEDRON":
            const remainingPolyhedra = [...state.polyhedra];
            remainingPolyhedra.splice(action.index, 1);
            return {
                ...state,
                polyhedra: remainingPolyhedra,
                selectedPolyhedronID: null
            };
        
        case "SELECT_POLYHEDRON":
            return {
                ...state,
                selectedPolyhedronID: action.index
            };

        case "DUPLICATE_POLYHEDRON":
            console.log("DISPATCHING DUPLICATE")
            const polyhedron = state.polyhedra[action.index]
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
            const currentPolyhedra = [...state.polyhedra, duplicatePolyhedron]

            return {
                ...state,
                polyhedra: currentPolyhedra,
                selectedPolyhedronID: currentPolyhedra.length - 1,
            };

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
        <PolyhedronContext.Provider value={{ polyhedra: state.polyhedra, dispatch, confirmationInfo: state.confirmationInfo, selectedPolyhedronID:state.selectedPolyhedronID, displayWarnings: state.displayWarnings }}>
            {props.children}
        </PolyhedronContext.Provider>
    );
}
