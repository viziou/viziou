import React, { createContext, useReducer, ReactNode } from 'react';
import { PolygonData, PolygonAction } from '../utils/types';

const initialState: PolygonContextInterface = {
    polygons: [],
};

interface PolygonContextInterface {
    polygons: PolygonData[];
    dispatch?: React.Dispatch<PolygonAction>;
}

export const PolygonContext = createContext<PolygonContextInterface | undefined>(undefined);

function PolygonReducer(state: PolygonContextInterface, action: PolygonAction) {
    switch (action.type) {
        case "ADD_SQUARE":

            console.log("Reducer ADD_SQUARE:", action.payload);
            return {
                ...state,
                polygons: [...state.polygons, action.payload],
            };

        case "ADD_RANDOM_POLYGON":

            console.log("Reducer ADD_RANDOM_POLYGON:", action.payload);
            return {
                ...state,
                polygons: [...state.polygons, action.payload],
            };

        case "CLEAR_POLYGONS":

            console.log("Reducer CLEAR_POLYGONS");
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
