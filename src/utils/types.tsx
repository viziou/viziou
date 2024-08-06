import * as THREE from 'three';

export type PolygonData = {
  position: [number, number];
  geometry: THREE.BufferGeometry;
  colour: string;
};

export type Scene2DProps = {
    polygons: PolygonData[];
}