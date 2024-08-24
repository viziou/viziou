import { createContext, useReducer, ReactNode } from 'react';
import { PolygonData, Polygon2DAction } from '../utils/types';

const initialState: PolygonContextInterface = {
    polygons: [],
};

interface PolygonContextInterface {
    polygons: PolygonData[];
    dispatch?: React.Dispatch<Polygon2DAction>;
}

export const PolygonContext = createContext<PolygonContextInterface | undefined>(undefined);

function PolygonReducer(state: PolygonContextInterface, action: Polygon2DAction) {
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
        <PolygonContext.Provider value={{ polygons: state.polygons, dispatch }}>
            {props.children}
        </PolygonContext.Provider>
    );
}
