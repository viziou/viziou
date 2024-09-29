import { createContext, useReducer, ReactNode } from 'react';
import { PolygonData, Polygon2DAction } from '../utils/types';

const initialState: PolygonContextInterface = {
    polygons: new Map<string, PolygonData>,
};

interface PolygonContextInterface {
    polygons: Map<string, PolygonData>;
    dispatch?: React.Dispatch<Polygon2DAction>;
}

export const PolygonContext = createContext<PolygonContextInterface | undefined>(undefined);

function key(polygon: PolygonData): string {
  // The key that uniquely indexes a polygon. This key can be more sophisticated if required.
  return `${polygon.id}`;
}

function PolygonReducer(state: PolygonContextInterface, action: Polygon2DAction) {
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
