import { createContext, useReducer, ReactNode } from 'react';
import { PolygonData, Polygon2DAction } from '../utils/types';

const initialState: PolygonContextInterface = {
    polygons: [],
    selectedPolygonIndex: null,
    currentlyMousedOverPolygons: []
};

interface PolygonContextInterface {
    polygons: PolygonData[];
    dispatch?: React.Dispatch<Polygon2DAction>;
    selectedPolygonIndex: number | null;
    currentlyMousedOverPolygons: number[];
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

        case "UPDATE_POSITION":
            const updatedPolygons = [...state.polygons];
            updatedPolygons[action.index].position = action.position;
            return {
                ...state,
                polygons: updatedPolygons
            };

        case "SELECT_POLYGON":
            return {
                ...state,
                selectedPolygonIndex: action.index
            };

        case "ADD_MOUSED_OVER_POLYGON":
            const mousedOver = state.currentlyMousedOverPolygons.slice();
            if (!mousedOver.includes(action.index)) {
                mousedOver.push(action.index)
            }
            return {
                ...state,
                currentlyMousedOverPolygons: mousedOver.slice()
            }

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
                currentlyMousedOverPolygons: mousedOverArr.slice()
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
        <PolygonContext.Provider value={{ polygons: state.polygons, dispatch, selectedPolygonIndex: state.selectedPolygonIndex, currentlyMousedOverPolygons: state.currentlyMousedOverPolygons}}>
            {props.children}
        </PolygonContext.Provider>
    );
}
