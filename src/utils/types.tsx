import * as THREE from 'three';

export type PolygonData = {
  position: [number, number];
  geometry: THREE.BufferGeometry;
  colour: string;
};

export type Scene2DProps = {
    polygons: PolygonData[];
}

export type AddSquareAction = {
    type: "ADD_SQUARE";
    payload: PolygonData;
};

export type AddRandomPolygonAction = {
    type: "ADD_RANDOM_POLYGON";
    payload: PolygonData;
};

export type ClearPolygonsAction = {
    type: "CLEAR_POLYGONS";
};

export type PolygonAction =
    | AddSquareAction
    | AddRandomPolygonAction
    | ClearPolygonsAction;