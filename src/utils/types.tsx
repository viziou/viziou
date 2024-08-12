import * as THREE from 'three';

export type PolygonData = {
  position: [number, number];
  geometry: THREE.BufferGeometry;
  colour: string;
};

export type Scene2DProps = {
    polygons: PolygonData[];
}

export type Polygon2DAction =
  | { type: "ADD_SQUARE"; payload: PolygonData }
  | { type: "ADD_RANDOM_POLYGON"; payload: PolygonData }
  | { type: "CLEAR_POLYGONS" };

export interface PolyhedronData {
    geometry: THREE.BufferGeometry;
    position: [number, number, number];
    colour: string;
}

export type Scene3DProps = {
    polyhedra: PolyhedronData[];
}

export type Polyhedron3DAction =
  | { type: "ADD_CUBE"; payload: PolyhedronData }
  | { type: "ADD_RANDOM_POLYHEDRON"; payload: PolyhedronData }
  | { type: "CLEAR_POLYHEDRA" };