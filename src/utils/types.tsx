import * as THREE from "three";

export type PolygonData = {
  position: [number, number];
  geometry: THREE.BufferGeometry;
  colour: string;
};

export type Scene2DProps = {
  polygons: PolygonData[];
};

export type Polygon2DAction =
  | { type: "ADD_SQUARE"; payload: PolygonData }
  | { type: "ADD_RANDOM_POLYGON"; payload: PolygonData }
  | { type: "ADD_POINT"; payload: PolygonData }
  | { type: "SET_POLYGONS"; payload: PolygonData[] }
  | { type: "CLEAR_POLYGONS" }
  | { type: "UPDATE_POSITION"; index: number; position: [number, number] }
  | { type: "SELECT_POLYGON"; index: number | null }
  | { type: "ADD_MOUSED_OVER_POLYGON"; index: number }
  | { type: "REMOVE_MOUSED_OVER_POLYGON"; index: number }
  | { type: "UPDATE_GEOMETRY"; index: number; geometry: THREE.BufferGeometry; position?: [number, number] }
  | { type: "DELETE_POLYGON"; index: number }
  | { type: "DUPLICATE_POLYGON"; index: number }
  | { type: "SET_EDIT"; index: number | null}
  | { type: "EDIT_POLYGON"; index: number, geometry: THREE.BufferGeometry; colour: string}
  | { type: "SELECTABILITY"; payload: boolean};

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