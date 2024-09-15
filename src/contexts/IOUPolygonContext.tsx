import { createContext, useReducer, ReactNode } from 'react';
import { IOUPolygon2DAction, IOUPolygonData } from '../utils/types';

const initialState: IOUPolygonContextInterface = {
    polygons: [],
    polygonMap: new Map<string, IOUPolygonData>,
};

interface IOUPolygonContextInterface {
    polygons: IOUPolygonData[],
    polygonMap: Map<string, IOUPolygonData>;
    dispatch?: React.Dispatch<IOUPolygon2DAction>;
}

function key(IOUPolygon: IOUPolygonData): string {
    /* Derives the key for this polygon combination. */
    return `${IOUPolygon.parentLow}+${IOUPolygon.parentHigh}`;
}

export const IOUPolygonContext = createContext<IOUPolygonContextInterface | undefined>(undefined);

function IOUPolygonReducer(state: IOUPolygonContextInterface, action: IOUPolygon2DAction) {
    switch (action.type) {
        case "SET_POLYGON":
            return {
                ...state,
                polygonMap: state.polygonMap.set(key(action.payload), action.payload),
            }

        default:
            return state;
    }
}

interface PolygonProviderProps {
    children: ReactNode;
}

export function IOUPolygonProvider(props: PolygonProviderProps) {
    const [state, dispatch] = useReducer(IOUPolygonReducer, initialState);

    return (
        <IOUPolygonContext.Provider value={{ polygons: Array.from(state.polygonMap.values()), polygonMap: state.polygonMap, dispatch }}>
            {props.children}
        </IOUPolygonContext.Provider>
    );
}
