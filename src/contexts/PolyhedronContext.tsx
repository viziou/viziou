import { createContext, useReducer, ReactNode } from 'react';
import { PolyhedronData, Polyhedron3DAction } from '../utils/types';

const initialState: PolyhedronContextInterface = {
    polyhedra: [],
};

interface PolyhedronContextInterface {
    polyhedra: PolyhedronData[];
    dispatch?: React.Dispatch<Polyhedron3DAction>;
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

        case "CLEAR_POLYHEDRA":
            return {
                ...state,
                polyhedra: [],
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
