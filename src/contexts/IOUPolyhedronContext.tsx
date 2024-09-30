import { createContext, useReducer, ReactNode } from 'react';
import { IOUPolyhedron3DAction, IOUPolyhedronData } from '../utils/types';
import { Backend3D } from '../backend/Interface';

const initialState: IOUPolyhedronContextInterface = {
  polyhedronMap: new Map<string, IOUPolyhedronData>,
    parentsMap: new Map<string, Set<string>>
};

interface IOUPolyhedronContextInterface {
    polyhedronMap: Map<string, IOUPolyhedronData>;
    parentsMap: Map<string, Set<string>>; // key-to-key matching for a single parent object
    dispatch?: React.Dispatch<IOUPolyhedron3DAction>;
}

function key(IOUPolyhedron: IOUPolyhedronData): string {
    /* Derives the key for this IoU polyhedron (given its parents). */
    const parentIDs = [IOUPolyhedron.parentIDa, IOUPolyhedron.parentIDb];
    const low = Math.min(...parentIDs);
    const high = Math.max(...parentIDs);
    return `${low}+${high}`;
}

// function extractParents(key: string): [string, string] {
//   /* From an IoU key, returns the two parent polyhedron's IDs. */
//   const [a, b] = key.split('+', 2);
//   return [a, b];
// }

function updateParents(state: IOUPolyhedronContextInterface, IOUPolyhedron: IOUPolyhedronData, create = true): void {
    const parentsA = state.parentsMap.get(`${IOUPolyhedron.parentIDa}`);
    const parentsB = state.parentsMap.get(`${IOUPolyhedron.parentIDb}`);
    // If there already is a parent set here then add to it. Otherwise, we have to initialise a new set.
    parentsA ? parentsA.add(key(IOUPolyhedron)) : (create && state.parentsMap.set(`${IOUPolyhedron.parentIDa}`, new Set([key(IOUPolyhedron)])));
    parentsB ? parentsB.add(key(IOUPolyhedron)) : (create && state.parentsMap.set(`${IOUPolyhedron.parentIDb}`, new Set([key(IOUPolyhedron)])));
}

export const IOUPolyhedronContext = createContext<IOUPolyhedronContextInterface | undefined>(undefined);

function IOUPolygonReducer(state: IOUPolyhedronContextInterface, action: IOUPolyhedron3DAction) {
  /* State management is given mainly by two data sets.

  *  The first is a Map that allows, given the IDs of two (non-IoU) polygons, to access the representing IoU polygon for
  *  this combination. Accessing and / or updating is O(1).

  *  The second is a Map that returns, given the ID of *one* (non-IoU) polygon, a list of keys that can be used to
  *  access the first Map, which correspond to all active IoU polygons that are associated with this single polygon.

  * */

    // associated: Set<string> | undefined;

    switch (action.type) {
        case "SET_POLYHEDRON":
            updateParents(state, action.payload);
            return {
                ...state,
              polyhedronMap: state.polyhedronMap.set(key(action.payload), action.payload),
                parentsMap: state.parentsMap,
            }

      case "UPDATE_POLYHEDRON":
        // only update if the IoU polygon already exists
        if (!state.polyhedronMap.has(key(action.payload))) {
          return {
            ...state,
            polyhedronMap: state.polyhedronMap,
            parentsMap: state.parentsMap,
          }
        }
        // otherwise we have an update to handle
        updateParents(state, action.payload, false);
          return {
            ...state,
            polyhedronMap: state.polyhedronMap.set(key(action.payload), action.payload),
            parentsMap: state.parentsMap,
          }

      case "RECALCULATE_CHILD_IOUS_USING_ID":
        console.log('recalculating children...')
        console.log('polyhedron map is ', action.payload.polyhedrons)
        state.parentsMap.get(`${action.payload.id}`)?.
        forEach((key) => {
          const polyhedron = state.polyhedronMap.get(key);

          if (polyhedron) {
            console.log('found IoU polyhedron with key ', key)
            const parentA = action.payload.polyhedrons.get(`${polyhedron.parentIDa}`)
            const parentB = action.payload.polyhedrons.get(`${polyhedron.parentIDb}`)

            if (parentA && parentB) {
              console.log('found parents: ', parentA, parentB)
              const { area, shape } = Backend3D.IoU(parentA, parentB)
              console.log('recalculated IoU is: ', area)
              polyhedron.geometry = shape;
              polyhedron.opacity = 1.0; // of course I forgot this lol
              state.polyhedronMap.set(key, polyhedron); // this set probably isn't necessary but might as well be safe
            }
          }
        });
        return {
          ...state,
          polyhedronMap: state.polyhedronMap,
          parentsMap: state.parentsMap
        }

      case "HIDE_CHILD_IOUS":
          state.parentsMap.get(`${action.payload.id}`)?.
          forEach((key) => {
            const polygon = state.polyhedronMap.get(key);
            if (polygon) {
              polygon.opacity = 0.0;
              state.polyhedronMap.set(key, polygon); // this set probably isn't necessary but might as well be safe
            }
          });
          return {
            ...state,
            polyhedronMap: state.polyhedronMap,
            parentsMap: state.parentsMap
          }

      case "HIDE_CHILD_IOUS_USING_ID":
          console.log('inside hide children')
          state.parentsMap.get(`${action.payload}`)?.
          forEach((key) => {
            const polygon = state.polyhedronMap.get(key);
            if (polygon) {
              console.log('setting child with key ', key, ' to have 0 opacity')
              console.log('state before: ', state.polyhedronMap);
              polygon.opacity = 0.0;
              state.polyhedronMap.set(key, polygon); // this set probably isn't necessary but might as well be safe
              console.log('state after: ', state.polyhedronMap);
            }
          });
          return {
            ...state,
            polyhedronMap: state.polyhedronMap,
            parentsMap: state.parentsMap
          }

      case "SHOW_CHILD_IOUS_USING_ID":
        state.parentsMap.get(`${action.payload}`)?.
        forEach((key) => {
          const polygon = state.polyhedronMap.get(key);
          if (polygon) {
            polygon.opacity = 1.0;
            state.polyhedronMap.set(key, polygon); // this set probably isn't necessary but might as well be safe
          }
        });
        return {
          ...state,
          polyhedronMap: state.polyhedronMap,
          parentsMap: state.parentsMap
        }


      case "DELETE_CHILD_IOUS":
            state.parentsMap.get(`${action.payload.id}`)?.
            forEach((key) => {
              state.polyhedronMap.delete(key);
            });
            return {
                ...state,
                polyhedronMap: state.polyhedronMap,
                parentsMap: state.parentsMap
            }

      case "DELETE_CHILD_IOUS_USING_ID":
            // get all keys that include this polygon ID, and then delete these associations in the polygon map
            state.parentsMap.get(`${action.id}`)?.
            forEach((key) => {
              state.polyhedronMap.delete(key);
            });
            return {
              ...state,
              polyhedronMap: state.polyhedronMap,
              parentsMap: state.parentsMap
            }

      case "CLEAR_POLYHEDRONS":
            state.polyhedronMap.clear();
            state.parentsMap.clear();
            return {
                ...state,
                polyhedronMap: state.polyhedronMap,
                parentsMap: state.parentsMap
            }

        default:
            return state;
    }
}

interface PolygonProviderProps {
    children: ReactNode;
}

export function IOUPolyhedronProvider(props: PolygonProviderProps) {
    const [state, dispatch] = useReducer(IOUPolygonReducer, initialState);

    return (
        <IOUPolyhedronContext.Provider value={{ polyhedronMap: state.polyhedronMap, parentsMap: state.parentsMap, dispatch }}>
            {props.children}
        </IOUPolyhedronContext.Provider>
    );
}
