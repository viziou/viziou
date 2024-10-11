import * as THREE from 'three'
import React from 'react'
import { EulerOrder } from 'three'

export type PolygonData = {
  id: number,
  position: [number, number],
  geometry: THREE.BufferGeometry,
  colour: string,
  opacity: number,
  generateId: () => number
};

export type IOUPolygonData = PolygonData & {
  parentIDa: number;  // the lower ID of the parent polygon
  parentIDb: number;
}

export type BoundingBoxProps = {
  id: number,
  position: [number, number],
  geometry: THREE.BufferGeometry,
  mesh: React.MutableRefObject<THREE.Mesh>,
  iouDispatch?: React.Dispatch<IOUPolygon2DAction>,
  generateId: () => number
}

export type IOUPolygon2DAction =
  | { type: 'SET_POLYGON', payload: IOUPolygonData }
  | { type: 'UPDATE_POLYGON', payload: IOUPolygonData }
  | { type: 'SHOW_POLYGON', payload: [number, number] }
  | { type: 'HIDE_POLYGON', payload: [number, number] }
  | { type: 'DELETE_POLYGON', payload: [number, number] }
  | { type: 'DELETE_CHILD_IOUS', payload: PolygonData }
  | { type: 'DELETE_CHILD_IOUS_USING_ID', payload: number }
  | { type: 'HIDE_CHILD_IOUS', payload: PolygonData }
  | { type: 'HIDE_CHILD_IOUS_USING_ID', payload: number }
  | { type: 'RECALCULATE_CHILD_IOUS_USING_ID', payload: { id: number, polygons: Map<string, PolygonData> } } // this could be cleaned up to not use the payload name attribute, honestly I wasn't sure if everything had to be named 'payload' when I wrote the context functions
  | { type: 'SHOW_CHILD_IOUS_USING_ID', payload: number }
  | { type: 'ADD_MOUSED_OVER_POLYGON', id: number }
  | { type: 'REMOVE_MOUSED_OVER_POLYGON', id: number }
  | { type: 'CLEAR_POLYGONS' };

export type Scene2DProps = {
  polygons: Map<string, PolygonData>,
  iouPolygons: Map<string, IOUPolygonData>,
  iouDispatch: React.Dispatch<IOUPolygon2DAction>,
  generateId: () => number
};

export type Polygon2DAction =
  | { type: 'ADD_SQUARE'; payload: PolygonData }
  | { type: 'ADD_RANDOM_POLYGON'; payload: PolygonData }
  | { type: 'ADD_POINT'; payload: PolygonData }
  | { type: 'SET_POLYGONS'; payload: PolygonData[] }
  | { type: 'CLEAR_POLYGONS' }
  | { type: 'UPDATE_POSITION'; id: number; position: [number, number] }
  | { type: 'SELECT_POLYGON'; id: number | null }
  | { type: 'ADD_MOUSED_OVER_POLYGON'; id: number }
  | { type: 'REMOVE_MOUSED_OVER_POLYGON'; id: number }
  | { type: 'UPDATE_GEOMETRY'; id: number; geometry: THREE.BufferGeometry; position?: [number, number] }
  | { type: 'DELETE_POLYGON'; id: number }
  | { type: 'DUPLICATE_POLYGON'; id: number, newId: number }
  | { type: 'SET_EDIT'; id: number | null }
  | { type: 'EDIT_POLYGON'; id: number, geometry: THREE.BufferGeometry; colour: string }
  | { type: 'SELECTABILITY'; payload: boolean }
  | { type: 'SET_DECIMAL_PRECISION'; precision: number }
  | { type: 'OPEN_CONFIRMATION_MODAL'; info: ConfirmationModalInfo }
  | { type: 'CLOSE_CONFIRMATION_MODAL'; }
  | { type: 'SET_DISPLAY_WARNINGS'; display: boolean };

export type PolyhedronData = {
  id: number;
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  rotation: [number, number, number, THREE.EulerOrder];
  scale: [number, number, number];
  colour: string;
  transformedVertices?: THREE.Vector3[];
  opacity: number;
  generateId: () => number
}

export type IOUPolyhedronData = PolyhedronData & {
  parentIDa: number;
  parentIDb: number;
}

export type Scene3DProps = {
  polyhedra: Map<string, PolyhedronData>;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedId: number | null;
  iouPolyhedrons: Map<string, IOUPolyhedronData>;
  iouDispatch: React.Dispatch<IOUPolyhedron3DAction>;
  generateId: () => number
};

export type Polyhedron3DAction =
  | { type: 'ADD_CUBE'; payload: PolyhedronData }
  | { type: 'ADD_RANDOM_POLYHEDRON'; payload: PolyhedronData }
  | { type: 'SET_POLYHEDRONS'; payload: PolyhedronData[] }
  | { type: 'CLEAR_POLYHEDRA' }
  | {
  type: 'UPDATE_POLYHEDRON';
  id: number;
  position: [number, number, number];
  rotation: [number, number, number, EulerOrder];
  scale: [number, number, number]
}
  | { type: 'DELETE_POLYHEDRON'; id: number }
  | { type: 'DUPLICATE_POLYHEDRON'; id: number, newId: number }
  | { type: 'SELECT_POLYHEDRON'; id: number | null }
  | { type: 'STORE_TRANSFORMED_VERTICES'; id: number; transformedVertices: THREE.Vector3[]; }
  | { type: 'OPEN_CONFIRMATION_MODAL'; info: ConfirmationModalInfo }
  | { type: 'CLOSE_CONFIRMATION_MODAL'; }
  | { type: 'SET_DISPLAY_WARNINGS'; display: boolean };

export type IOUPolyhedron3DAction =
  | { type: 'SET_POLYHEDRON', payload: IOUPolyhedronData }
  | { type: 'UPDATE_POLYHEDRON', payload: IOUPolyhedronData }
  | { type: 'SHOW_POLYHEDRON', payload: [number, number] }
  | { type: 'HIDE_POLYHEDRON', payload: [number, number] }
  | { type: 'DELETE_POLYHEDRON', payload: [number, number] }
  | { type: 'DELETE_CHILD_IOUS', payload: IOUPolyhedronData }
  | { type: 'DELETE_CHILD_IOUS_USING_ID', id: number }
  | { type: 'HIDE_CHILD_IOUS', payload: PolyhedronData }
  | { type: 'HIDE_CHILD_IOUS_USING_ID', payload: number }
  | { type: 'RECALCULATE_CHILD_IOUS_USING_ID', payload: { id: number, polyhedrons: Map<string, PolyhedronData> } }
  | { type: 'SHOW_CHILD_IOUS_USING_ID', payload: number }
  | { type: 'CLEAR_POLYHEDRONS' };

export type SidebarProps2D = {
  polygons: PolygonData[];
  addPolygon: () => void;
  clearPolygons: () => void;
  showIoUs: () => void;
  clearIoUs: () => void;
  savePolygons: () => void;
  loadPolygons: () => Promise<void>;
}

export type SidebarProps3D = {
  polyhedrons: any[],
  addRandomPolyhedron: () => void,
  clearPolyhedrons: () => void,
  showIoUs: () => void,
  savePolyhedrons: () => void,
  loadPolyhedrons: () => void,
  clearIoUs: () => void
}

export type ConfirmationModalInfo = {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  message: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}
