import * as THREE from "three";
import React from 'react'

export type PolygonData = {
  id: number,
  position: [number, number];
  geometry: THREE.BufferGeometry;
  colour: string;
  opacity: number;
};

export type IOUPolygonData = PolygonData & {
  parentIDa: number;  // the lower ID of the parent polygon
  parentIDb: number;
}

export type IOUPolygon2DAction =
  | { type: "SET_POLYGON", payload: IOUPolygonData }
  | { type: "UPDATE_POLYGON", payload: IOUPolygonData }
  | { type: "SHOW_POLYGON", payload: [number, number] }
  | { type: "HIDE_POLYGON", payload: [number, number] }
  | { type: "DELETE_POLYGON", payload: [number, number] }
  | { type: "DELETE_CHILD_IOUS", payload: PolygonData }
  | { type: "DELETE_CHILD_IOUS_USING_ID", payload: number }
  | { type: "HIDE_CHILD_IOUS", payload: PolygonData}
  | { type: "HIDE_CHILD_IOUS_USING_ID", payload: number}
  | { type: "RECALCULATE_CHILD_IOUS_USING_ID", payload: {id: number, polygons: Map<string, PolygonData>}}
  | { type: "SHOW_CHILD_IOUS_USING_ID", payload: number }
  | { type: "CLEAR_POLYGONS" };

export type Scene2DProps = {
  polygons: Map<string, PolygonData>;
  iouPolygons: Map<string, IOUPolygonData>;
  iouDispatch: React.Dispatch<IOUPolygon2DAction>;
};

export type Polygon2DAction =
  | { type: "ADD_SQUARE"; payload: PolygonData }
  | { type: "ADD_RANDOM_POLYGON"; payload: PolygonData }
  | { type: "ADD_POINT"; payload: PolygonData }
  | { type: "SET_POLYGONS"; payload: PolygonData[] }
  | { type: "CLEAR_POLYGONS" }
  | { type: "UPDATE_POSITION"; id: number; position: [number, number] }
  | { type: "SELECT_POLYGON"; index: number | null }
  | { type: "ADD_MOUSED_OVER_POLYGON"; index: number }
  | { type: "REMOVE_MOUSED_OVER_POLYGON"; index: number }
  | { type: "UPDATE_GEOMETRY"; index: number; geometry: THREE.BufferGeometry; position?: [number, number] }
  | { type: "DELETE_POLYGON"; index: number }
  | { type: "DUPLICATE_POLYGON"; index: number }
  | { type: "SET_EDIT"; index: number | null}
  | { type: "EDIT_POLYGON"; index: number, geometry: THREE.BufferGeometry; colour: string}
  | { type: "SELECTABILITY"; payload: boolean}
  | { type: "SET_DECIMAL_PRECISION"; precision: number};

export interface PolyhedronData {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  colour: string;
  transformedVertices?: THREE.Vector3[];
}

export type Scene3DProps = {
  polyhedra: PolyhedronData[];
  setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
  selectedIndex: number | null;
};

export type Polyhedron3DAction =
  | { type: "ADD_CUBE"; payload: PolyhedronData }
  | { type: "ADD_RANDOM_POLYHEDRON"; payload: PolyhedronData }
  | { type: "SET_POLYHEDRONS"; payload: PolyhedronData[] }
  | { type: "CLEAR_POLYHEDRA" }
  | { type: "UPDATE_POLYHEDRON"; index: number; position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] }
  | { type: "STORE_TRANSFORMED_VERTICES"; index: number; transformedVertices: THREE.Vector3[];

  };

export type SidebarProps2D = {
  polygons: PolygonData[];
  addPolygon: () => void;
  clearPolygons: () => void;
  showIoUs: () => void;
  savePolygons: () => void;
  loadPolygons: () => Promise<void>;
}

export type SidebarProps3D = {
  polyhedrons: any[];
  addRandomPolyhedron: () => void;
  clearPolyhedrons: () => void;
  // showIoUs: () => void;
  savePolyhedrons: () => void;
  loadPolyhedrons: () => void;
}
