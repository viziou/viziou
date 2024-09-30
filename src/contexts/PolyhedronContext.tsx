import { createContext, useReducer, ReactNode } from 'react';
import { PolyhedronData, Polyhedron3DAction } from '../utils/types';

const initialState: PolyhedronContextInterface = {
    polyhedra: new Map<string, PolyhedronData>,
};

interface PolyhedronContextInterface {
    polyhedra: Map<string, PolyhedronData>;
    dispatch?: React.Dispatch<Polyhedron3DAction>;
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
            for (const polygon of action.payload) {
              state.polyhedra.set(key(polygon), polygon);
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

        case "STORE_TRANSFORMED_VERTICES":
            const updatedPolyhedraWithVertices = state.polyhedra.get(`${action.id}`);

            if (updatedPolyhedraWithVertices) {
              updatedPolyhedraWithVertices.transformedVertices = action.transformedVertices;
            }

            return {
                ...state,
                polyhedra: state.polyhedra,
            };

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
        <PolyhedronContext.Provider value={{ polyhedra: state.polyhedra, dispatch }}>
            {props.children}
        </PolyhedronContext.Provider>
    );
}
