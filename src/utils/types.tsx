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
  | { type: "RECALCULATE_CHILD_IOUS_USING_ID", payload: {id: number, parentGeometry: THREE.BufferGeometry}}
  | { type: "SHOW_CHILD_IOUS_USING_ID", payload: number }
  | { type: "CLEAR_POLYGONS" };

export type Scene2DProps = {
  polygons: PolygonData[];
  iouPolygons: Map<string, IOUPolygonData>;
  iouDispatch: React.Dispatch<IOUPolygon2DAction>;
};

export type Polygon2DAction =
  | { type: "ADD_SQUARE"; payload: PolygonData }
  | { type: "ADD_RANDOM_POLYGON"; payload: PolygonData }
  | { type: "ADD_POINT", payload: PolygonData }
  | { type: "SET_POLYGONS"; payload: PolygonData[] }
  | { type: "CLEAR_POLYGONS" }
  | { type: "UPDATE_POSITION"; index: number; position: [number, number] };

export interface PolyhedronData {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  colour: string;
}

export type Scene3DProps = {
  polyhedra: PolyhedronData[];
};

export type Polyhedron3DAction =
  | { type: "ADD_CUBE"; payload: PolyhedronData }
  | { type: "ADD_RANDOM_POLYHEDRON"; payload: PolyhedronData }
  | { type: "SET_POLYHEDRONS"; payload: PolyhedronData[] }
  | { type: "CLEAR_POLYHEDRA" }
  | { type: "UPDATE_POLYHEDRON"; index: number; position: [number, number, number] };

