import { createContext, useReducer, ReactNode } from 'react';
import { IOUPolygon2DAction, IOUPolygonData } from '../utils/types';
import { Backend2D } from '../backend/Interface';

const initialState: IOUPolygonContextInterface = {
    polygonMap: new Map<string, IOUPolygonData>,
    parentsMap: new Map<string, Set<string>>,
    currentlyMousedOverPolygons: [],
    currentDecimalPlaces: 2,
};

interface IOUPolygonContextInterface {
    polygonMap: Map<string, IOUPolygonData>;
    parentsMap: Map<string, Set<string>>; // key-to-key matching for a single parent object
    currentlyMousedOverPolygons: number[];
    dispatch?: React.Dispatch<IOUPolygon2DAction>;
    currentDecimalPlaces: number;
}

function key(IOUPolygon: IOUPolygonData): string {
    /* Derives the key for this IoU polygon (given its parents). */
    const parentIDs = [IOUPolygon.parentIDa, IOUPolygon.parentIDb];
    const low = Math.min(...parentIDs);
    const high = Math.max(...parentIDs);
    return `${low}+${high}`;
}

// function extractParents(key: string): [string, string] {
//   /* From an IoU key, returns the two parent polygon's IDs. */
//   const [a, b] = key.split('+', 2);
//   return [a, b];
// }

function updateParents(state: IOUPolygonContextInterface, IOUPolygon: IOUPolygonData, create = true): void {
    const parentsA = state.parentsMap.get(`${IOUPolygon.parentIDa}`);
    const parentsB = state.parentsMap.get(`${IOUPolygon.parentIDb}`);
    // If there already is a parent set here then add to it. Otherwise, we have to initialise a new set.
    parentsA ? parentsA.add(key(IOUPolygon)) : (create && state.parentsMap.set(`${IOUPolygon.parentIDa}`, new Set([key(IOUPolygon)])));
    parentsB ? parentsB.add(key(IOUPolygon)) : (create && state.parentsMap.set(`${IOUPolygon.parentIDb}`, new Set([key(IOUPolygon)])));
}

export const IOUPolygonContext = createContext<IOUPolygonContextInterface | undefined>(undefined);

function IOUPolygonReducer(state: IOUPolygonContextInterface, action: IOUPolygon2DAction) {
  /* State management is given mainly by two data sets.

  *  The first is a Map that allows, given the IDs of two (non-IoU) polygons, to access the representing IoU polygon for
  *  this combination. Accessing and / or updating is O(1).

  *  The second is a Map that returns, given the ID of *one* (non-IoU) polygon, a list of keys that can be used to
  *  access the first Map, which correspond to all active IoU polygons that are associated with this single polygon.

  * */

    // associated: Set<string> | undefined;

    switch (action.type) {
        case "SET_POLYGON":
            updateParents(state, action.payload);
            return {
                ...state,
                polygonMap: state.polygonMap.set(key(action.payload), action.payload),
                parentsMap: state.parentsMap,
            }

            // TODO: Hide polygons associated with a *single* parent
            // consider a

      case "UPDATE_POLYGON":
        // only update if the IoU polygon already exists
        if (!state.polygonMap.has(key(action.payload))) {
          return {
            ...state,
            polygonMap: state.polygonMap,
            parentsMap: state.parentsMap,
          }
        }
        // otherwise we have an update to handle
        updateParents(state, action.payload, false);
          return {
            ...state,
            polygonMap: state.polygonMap.set(key(action.payload), action.payload),
            parentsMap: state.parentsMap,
          }

      case "RECALCULATE_CHILD_IOUS_USING_ID":
        console.log('recalculating children...')
        console.log('polygons map is ', action.payload.polygons)
        state.parentsMap.get(`${action.payload.id}`)?.
        forEach((key) => {
          const polygon = state.polygonMap.get(key);

          if (polygon) {
            console.log('found IoU polygon with key ', key)
            const parentA = action.payload.polygons.get(`${polygon.parentIDa}`)
            const parentB = action.payload.polygons.get(`${polygon.parentIDb}`)

            if (parentA && parentB) {
              console.log('found parents: ', parentA, parentB)
              const { area, shape } = Backend2D.IoU(parentA, parentB)
              console.log('recalculated IoU is: ', area)
              polygon.geometry = shape;
              polygon.opacity = 1.0; // of course I forgot this lol
              state.polygonMap.set(key, polygon); // this set probably isn't necessary but might as well be safe
            }
          }
        });
        return {
          ...state,
          polygonMap: state.polygonMap,
          parentsMap: state.parentsMap
        }

      case "HIDE_CHILD_IOUS":
          state.parentsMap.get(`${action.payload.id}`)?.
          forEach((key) => {
            const polygon = state.polygonMap.get(key);
            if (polygon) {
              polygon.opacity = 0.0;
              state.polygonMap.set(key, polygon); // this set probably isn't necessary but might as well be safe
            }
          });
          return {
            ...state,
            polygonMap: state.polygonMap,
            parentsMap: state.parentsMap
          }

      case "HIDE_CHILD_IOUS_USING_ID":
          console.log('inside hide children')
          state.parentsMap.get(`${action.payload}`)?.
          forEach((key) => {
            const polygon = state.polygonMap.get(key);
            if (polygon) {
              console.log('setting child with key ', key, ' to have 0 opacity')
              console.log('state before: ', state.polygonMap);
              polygon.opacity = 0.0;
              state.polygonMap.set(key, polygon); // this set probably isn't necessary but might as well be safe
              console.log('state after: ', state.polygonMap);
            }
          });
          return {
            ...state,
            polygonMap: state.polygonMap,
            parentsMap: state.parentsMap
          }

      case "SHOW_CHILD_IOUS_USING_ID":
        state.parentsMap.get(`${action.payload}`)?.
        forEach((key) => {
          const polygon = state.polygonMap.get(key);
          if (polygon) {
            polygon.opacity = 1.0;
            state.polygonMap.set(key, polygon); // this set probably isn't necessary but might as well be safe
          }
        });
        return {
          ...state,
          polygonMap: state.polygonMap,
          parentsMap: state.parentsMap
        }


      case "DELETE_CHILD_IOUS":
            state.parentsMap.get(`${action.payload.id}`)?.
            forEach((key) => {
              state.polygonMap.delete(key);
            });
            return {
                ...state,
                polygonMap: state.polygonMap,
                parentsMap: state.parentsMap
            }

      case "DELETE_CHILD_IOUS_USING_ID":
            // get all keys that include this polygon ID, and then delete these associations in the polygon map
            state.parentsMap.get(`${action.payload}`)?.
            forEach((key) => {
              state.polygonMap.delete(key);
            });
            return {
              ...state,
              polygonMap: state.polygonMap,
              parentsMap: state.parentsMap
            }

      case "CLEAR_POLYGONS":
            state.polygonMap.clear();
            state.parentsMap.clear();
            return {
                ...state,
                polygonMap: state.polygonMap,
                parentsMap: state.parentsMap
            }

        default:
            return state;

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
    }
}

interface PolygonProviderProps {
    children: ReactNode;
}

export function IOUPolygonProvider(props: PolygonProviderProps) {
    const [state, dispatch] = useReducer(IOUPolygonReducer, initialState);

    return (
        <IOUPolygonContext.Provider value={{ polygonMap: state.polygonMap, parentsMap: state.parentsMap,
          currentlyMousedOverPolygons: state.currentlyMousedOverPolygons, currentDecimalPlaces: state.currentDecimalPlaces, dispatch }}>
            {props.children}
        </IOUPolygonContext.Provider>
    );
}
