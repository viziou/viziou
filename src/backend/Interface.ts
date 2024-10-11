/* API that is exposed to the front-end. */
import { PolygonData, PolyhedronData } from '../utils/types.tsx';
import { Point2D, Polygon2D } from './2D/classes.ts';
import { IoU, getIntersectionPolygon } from './2D/iou.ts';
import { IoU as IoU3D, getIntersectionPolyhedra } from "./3D/iou.ts";
import { ConvexHull, Face } from 'three/addons/math/ConvexHull.js'; // QuickHull implementation
import { ConvexGeometry as ConvexGeometry3 } from 'three/addons/geometries/ConvexGeometry.js';
import { BufferGeometry, TypedArray, Vector3 } from 'three';
import { Handler as Handler2D, vLatest as vLatest2D } from './2D/PolygonFile.ts';
import { Handler as Handler3D, vLatest as vLatest3D } from './3D/PolyhedronFile.ts';
import {Face3D, Point3D, Polyhedra3D} from "./3D/classes.ts";
import {HalfEdge} from 'three/addons/math/ConvexHull.js';

class ConvexGeometry {

  public static fromPoints(points: Vector3[]) {
    // TODO: Allow skipping the convex hull reduction process by passing in a boolean flag.
    // First reduce the points to a convex hull.
    points = this.reducePointsToConvexHull(points);

    // Naive triangulation method, our vertices are already sorted so these should be CCW mini-triangles already.
    const vertices: Vector3[] = [];
    const baseVertex = points[0];

    for (let i = 1, j = 2; j < points.length; i++, j++) {
      vertices.push(baseVertex);
      vertices.push(points[i]);
      vertices.push(points[j]);
      //vertices.push(new Vector3(baseVertex.x, baseVertex.y, 0));
      //vertices.push(new Vector3(points[i].x, points[i].y, 0));
      //vertices.push(new Vector3(points[j].x, points[j].y, 0));
    }

    const convexGeom = new BufferGeometry();
    convexGeom.setFromPoints(vertices);
    return convexGeom;
  }

  public static reducePointsToConvexHull(points: Vector3[]): Vector3[] {
    // TODO: Don't convert to Point2D, just do the convex hull directly.
    // TODO: Make it so convex hull reduction can be done directly with Vector3
    const pointsTemp: Point2D[] = [];
    for (const point of points) {
      pointsTemp.push(new Point2D(point.x, point.y));
    }

    const reduced = Backend2D._reducePointsToConvexHull(pointsTemp);

    const reproduced: Vector3[] = [];
    for (const point of reduced) {
      reproduced.push(new Vector3(point.x, point.y, 0));
    }

    return reproduced;
  }
}

class Backend2D {

  public static area( geometry: BufferGeometry ) {
    return this._threeGeometryToPolygon2D(geometry).area();
  }

  public static perimeter( geometry: BufferGeometry ) {
    return this._threeGeometryToPolygon2D(geometry).perimeter();
  }

  public static pointInPolygon({x, y}: { x: number; y: number }, { geometry, position }: PolygonData) {
    const point = new Point2D(x, y);
    const offset = new Point2D(position[0], position[1]);
    const polygon = this._threeGeometryToPolygon2D(geometry).translate(offset);
    return polygon.includes(point);
  }

  public static IoU({ geometry: geometryA, position: positionA }: PolygonData,
             { geometry: geometryB, position: positionB }: PolygonData) {
    const offsetA = new Point2D(positionA[0], positionA[1]);
    const offsetB = new Point2D(positionB[0], positionB[1]);

    const polygonA = this._threeGeometryToPolygon2D(geometryA).translate(offsetA);
    const polygonB = this._threeGeometryToPolygon2D(geometryB).translate(offsetB);
    return {area: IoU(polygonA, polygonB),
      shape: this._polygon2DtoThreeGeometry(getIntersectionPolygon(polygonA, polygonB)) };
  }

  public static centreOfMass({geometry, position}: PolygonData): {x: number; y: number} {
    const offset = new Point2D(position[0], position[1]);
    return this._threeGeometryToPolygon2D(geometry).centroid().translate(offset).xy;
  }

  public static _threeGeometryToPolygon2D( geometry: BufferGeometry ): Polygon2D {
    function key({x, y}: {x: number; y: number}) {
      return `${x},${y}`;
    }

    const geometryPosition = geometry.getAttribute('position');
    // console.log('geometryPosition: ', geometryPosition)
    let vertices: Point2D[] = [];
    const vertexMap: Map<string, {x: number, y: number}> = new Map();
    for (let i = 0; i < geometryPosition.array.length; i+=3 ) {
      //vertices.push(new Point2D(geometryPosition.array[i], geometryPosition.array[i + 1]));
      const pos = {x: geometryPosition.array[i], y: geometryPosition.array[i + 1]};
      vertexMap.set(key(pos), pos);  // maps do not allow duplicates
    }
    vertexMap.forEach(({x, y}) => {
      vertices.push(new Point2D(x, y))
    })
    // console.log('vertexMap: ', vertexMap);
    // console.log('vertices: ', vertices)
    // console.log('number of vertices parsed: ', geometryPosition.count / 3);
    // console.log('number of vertices included: ', vertices.length)
    vertices = this._reducePointsToConvexHull(vertices);
    // console.log('vertices after convex hull reduction: ', vertices);
    // console.log('number of vertices on hull: ', vertices.length)
    return new Polygon2D(vertices, true);
  }

  private static _polygon2DtoThreeGeometry(polygon: Polygon2D): BufferGeometry  {
    const pointsPoly = polygon.vertices.length;
    console.log('Points in Polygon2D: ', pointsPoly);

    const polyVerts = polygon.vertices;

    const vertices: Vector3[] = [];
    const verticesOld: Vector3[] = [];
    const baseVertex = polyVerts[0];

    // This variant does not work as intended.
    for (const polygon of polyVerts) {
      verticesOld.push(new Vector3(polygon.x, polygon.y, 0));
    }

    // Naive triangulation method, our vertices are already sorted so these should be CCW mini-triangles already.
    for (let i = 1, j = 2; j < polygon.vertices.length; i++, j++) {
      vertices.push(new Vector3(baseVertex.x, baseVertex.y, 0));
      vertices.push(new Vector3(polyVerts[i].x, polyVerts[i].y, 0));
      vertices.push(new Vector3(polyVerts[j].x, polyVerts[j].y, 0));
    }

    const convexGeom = new BufferGeometry();
    convexGeom.setFromPoints(vertices);
    const oldGeom = new BufferGeometry();
    oldGeom.setFromPoints(verticesOld);
    console.log('old length: ', verticesOld.length);
    console.log('new length: ', vertices.length);
    console.log('oldGeometry: ', oldGeom);
    console.log('convexGeom: ', convexGeom);
    //const convexGeom = new ConvexGeometry(vertices);
    const pointsGeom = convexGeom.getAttribute('position').count / 3
    console.log('Points in ConvexGeometry: ', pointsGeom);
    if (pointsPoly !== pointsGeom) {
      console.log('F*** 3JS!!!!!!!');
    }
    return convexGeom
  }

  public static reduceThreeGeometry(polygon: PolygonData) {
    const geometryPosition = polygon.geometry.getAttribute('position');
    let vertices: Point2D[] = [];
    const vertexSet: Set<{x: number, y: number}> = new Set();
    for (let i = 0, l = geometryPosition.count; i < l; i+=3 ) {
      //vertices.push(new Point2D(geometryPosition.array[i], geometryPosition.array[i + 1]));
      vertexSet.add({x: geometryPosition.array[i], y: geometryPosition.array[i + 1]});  // sets do not allow duplicates
    }
    vertexSet.forEach(({x, y}) => {
      vertices.push(new Point2D(x, y))
    })
    vertices = this._reducePointsToConvexHull(vertices);
     //console.log('vertices after convex hull reduction: ', vertices);
     //console.log('number of vertices on hull: ', vertices.length)
    return new Polygon2D(vertices, true);
  }

  public static _reducePointsToConvexHull(points: Point2D[]) {
    // This code is ugly as hell since there was so much debugging involved to get it working.
    //console.log('initial points: ', points);
    // Step 0: If you have a triangle (or less), there's nothing to do.
    if (points.length < 3) return points;
    const reducedVertices: Point2D[] = [];

    // Step 1: Find an extremal starting point.
    let extremalPointStart = points[0];
    let extramalPointIndex = 0
    for (const [index, point] of points.slice(1).entries()) {
      if (point.y < extremalPointStart.y) {
        extremalPointStart = point;
        extramalPointIndex = index + 1; // IMPORTANT: the indexes have changed AAAAAAA
      }
    }
    //console.log('extremal point: ', extremalPointStart);
    reducedVertices.push(extremalPointStart)

    // Step 2: Find another extremal point that must be on the convex hull. The first attempt is to determine
    // the smallest angle with the x-axis using points to the *right* of our extremal.
    const onRight = points.flatMap((point, idx) => {
      if (point.x >= reducedVertices[0].x && point.y !== reducedVertices[0].y) {
        return [{point: point, orig_idx: idx}];
      }
      else {
        return [];
      }
    });
    //console.log('points to the right: ', onRight);

    // If there are no points to the right, then we rotate our investigation by 90 degrees and determine the smallest
    // angle with the y-axis to points above our extreme. This works because to get to this condition, our extremal is
    // already the right-most point.
    const above = points.flatMap((point, idx) => {
      if (point.x !== reducedVertices[0].x && point.y >= reducedVertices[0].y) {
        return [{point: point, orig_idx: idx}];
      }
      else {
        return [];
      }
    });
    let angles: {angle: number, orig_idx: number}[];
    if (onRight.length === 0) {
      angles = above.map(({point, orig_idx}) => {
        const vector = point.sub(reducedVertices[0])
        return { angle: (Math.acos(vector.y / vector.magnitude())), orig_idx: orig_idx };
      })
    }
    else {
      angles = onRight.map(({ point, orig_idx }) => {
        const vector = point.sub(reducedVertices[0]); // vector from extreme to this point
        //console.log(vector.x / vector.distanceToOrigin())
        return { angle: (Math.acos(vector.x / vector.magnitude())), orig_idx: orig_idx };
      })
    }
    //console.log('angles on the right: ', angles);
    let min_angle = 360;
    let min_angle_index = 0
    for (const {angle, orig_idx} of angles) {
      // search for minimum angle
      if (angle < min_angle) {
        min_angle = angle;
        min_angle_index = orig_idx;
      }
    }
    reducedVertices.push(points[min_angle_index]);
    //console.log('current wrap (after initial point): ', reducedVertices);

    // Step 3: Now that we have a vector that is on the convex hull, we can brute-force a solution by continually
    // maximising the angle between this vector (which just an edge) and our next edge.
    let finished = false;
    while (!finished) {
      const angles = points.map((point, index) => {
        const vector_behind = reducedVertices[reducedVertices.length - 1].sub(reducedVertices[reducedVertices.length - 2]) // recover previous vector
        const vector = reducedVertices[reducedVertices.length - 1].sub(point) // calculate this vector
        //console.log('inside next angle: ', vector.x / vector.distanceToOrigin());
        return {angle: Math.acos(vector_behind.dot(vector) / (vector_behind.magnitude() * vector.magnitude())), orig_idx: index}
      });
      //console.log('current wrap: ', reducedVertices);
      //console.log('next angles: ', angles);
      let max_angle = 0;
      let max_angle_index = 0
      for (const {orig_idx, angle} of angles) {
        // search for maximum angle
        if (angle > max_angle) {
          max_angle = angle;
          max_angle_index = orig_idx;

        }
        }
        //console.log('determined that the next point is ', points[max_angle_index], ' with angle ', max_angle)
      // if we come back to the start then that's a wrap (literally)
      if (max_angle_index === extramalPointIndex) {
        //console.log('final max angle: ', max_angle, ' occurred at: ', max_angle_index);
        finished = true;
      } else {
        reducedVertices.push(points[max_angle_index]);
        }
      }
    return reducedVertices;
  }
}

class Backend3D {

  public static volume( geometry: BufferGeometry) {
    return this._threeGeometryToPolyhedra3D(geometry).volume();
  }

  public static pointInPolyhedron({geometry}: PolyhedronData, point: Vector3) {
    return this._threeGeometryToConvexHull(geometry).containsPoint(point)
  }

  public static centreOfMass({geometry}: PolyhedronData) {
    return this._threeGeometryToPolyhedra3D(geometry).centroid()
  }

  public static IoU({geometry: geometryA, position: positionA, rotation: rotationA, scale: scaleA}: PolyhedronData,
                    {geometry: geometryB, position: positionB, rotation: rotationB, scale: scaleB}: PolyhedronData): {area: number, shape: BufferGeometry} {
    const offsetA = new Point3D(positionA[0], positionA[1], positionA[2]);
    const offsetB = new Point3D(positionB[0], positionB[1], positionB[2]);
    const polyhedronA = this._threeGeometryToPolyhedra3D(geometryA).scale(...scaleA).rotate(rotationA[0], rotationA[1], rotationA[2]).translate(offsetA);
    const polyhedronB = this._threeGeometryToPolyhedra3D(geometryB).scale(...scaleB).rotate(rotationB[0], rotationB[1], rotationB[2]).translate(offsetB);
    return {area: IoU3D(polyhedronA, polyhedronB),
    shape: this._polyhedra3DToBufferGeometry(getIntersectionPolyhedra(polyhedronA, polyhedronB))}
  }

  public static reduceVectorThrees(array: number[] | TypedArray) {
    function key({x, y, z}: {x: number, y: number, z: number}) {
      return `${x},${y},${z}`;
    }

    const vectorMap: Map<string, Vector3> = new Map();
    for (let i = 0; i < array.length; i+=3) {
      const pos = new Vector3(array[i], array[i+1], array[i+2]);
      vectorMap.set(key(pos), pos);
    }

    return Array.from(vectorMap.values());
  }

  public static _polyhedra3DToBufferGeometry(polyhedron: Polyhedra3D) {
    function key({x, y, z}: {x: number, y: number, z: number}) {
      return `${x},${y},${z}`;
    }

    const vectorMap: Map<string, Vector3> = new Map();
    for (const face of polyhedron.faces) {
      const points = this._face3DToVector3(face)
      for (const point of points) {
        vectorMap.set(key(point), point);
      }
    }

    const vectors = Array.from(vectorMap.values());
    return new ConvexGeometry3(vectors);
  }

  public static _threeGeometryToConvexHull( geometry: BufferGeometry ) {
      const hull = new ConvexHull();
      const points: Vector3[] = this.reduceVectorThrees( geometry.getAttribute('position').array );
      hull.setFromPoints(points);
      hull.compute();
      return hull
  }

  public static _faceToFace3D(face: Face) {
    const vertices: Point3D[] = [];
    const edges: HalfEdge[] = [];
    let edge = face.edge;
    edges.push(edge); // edge 1
    edge = edge.next;
    edges.push(edge); // edge 2
    edge = edge.next;
    edges.push(edge); // edge 3

    for (const edge of edges) {
      const point: Vector3 = edge.vertex.point;
      vertices.push(new Point3D(point.x, point.y, point.z));
    }
    return new Face3D(vertices);
  }

  public static _convexHullToPolyhedra(hull: ConvexHull) {
    const faces = hull.faces.map(this._faceToFace3D);
    return new Polyhedra3D(faces);
  }

  public static _threeGeometryToPolyhedra3D(geometry: BufferGeometry) {
    return this._convexHullToPolyhedra(this._threeGeometryToConvexHull(geometry));
  }

  public static _face3DToVector3(face: Face3D) {
    const vertices: Vector3[] = [];
    for (const point of face.vertices) {
      vertices.push(new Vector3(point.x, point.y, point.z));
    }
    return vertices;
  }

}

class Storage {

  public static save2D(polygons: PolygonData[], name: string) {
    // TODO: should probably not create the vLatest object here, should be prepareSave's responsibility
    const fileData = [Handler2D.prepareSave(new vLatest2D(polygons))] // this has to be an array of files

    // this might be different on browser vs. electron
    const file = new File(fileData, name, { type: "text/plain", });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name + '.viz'

    // simulate a click
    document.body.appendChild(a); // necessary for firefox?
    a.click();
    document.body.removeChild(a); // let's not overflow the page
  }

  public static save3D(polyhedra: PolyhedronData[], name: string) {
    // TODO: should probably not create the vLatest object here, should be prepareSave's responsibility
    const fileData = [Handler3D.prepareSave(new vLatest3D(polyhedra))] // this has to be an array of files

    // this might be different on browser vs. electron
    // TODO: this is a completely duplicated code fragment from here on
    const file = new File(fileData, name, { type: "text/plain", });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name + '.viz'

    // simulate a click
    document.body.appendChild(a); // necessary for firefox?
    a.click();
    document.body.removeChild(a); // let's not overflow the page
  }

  public static async load2D() {
    const u = document.createElement('input');
    u.type = 'file';
    u.style.display = 'none';
    u.accept = '.viz';
    u.multiple = false; // TODO feat: merge multiple .viz files?

    // add event listeners
    const cl = new Promise((resolve) => {
      u.addEventListener('cancel', resolve, false);
    })

    const ch = new Promise((resolve) => {
      u.addEventListener('change', resolve, false);
    })

    // simulate a click
    document.body.appendChild(u);
    u.click();

    // block until one of these resolves
    await Promise.any([cl, ch]);

    // if the user sent a file then it's inside the 'u' HTML element
    // TODO feat: handle merging multiple .viz files!
    if (u.files && u.files.length === 1) {
      console.log('User requested file upload ', u.files[0]);
      document.body.removeChild(u); // cleanup
      const handle = u.files[0]; // 'u' is no longer part of the DOM but it's still in memory
      const content = await handle.text(); // get the text representation (UTF-8 only)
      console.log('Text representation: ', content)
      const pl = Handler2D.prepareLoad(content); // the PolygonData array in this file
      console.log('Object representation: ', pl)
      return pl
    }

    // TODO: two removeChild calls is dirty

    console.log("User cancelled file upload.")
    document.body.removeChild(u); // cleanup
    return null;
  }

  public static async load3D() {
    const u = document.createElement('input');
    u.type = 'file';
    u.style.display = 'none';
    u.accept = '.viz';
    u.multiple = false; // TODO feat: merge multiple .viz files?

    // add event listeners
    const cl = new Promise((resolve) => {
      u.addEventListener('cancel', resolve, false);
    })

    const ch = new Promise((resolve) => {
      u.addEventListener('change', resolve, false);
    })

    // simulate a click
    document.body.appendChild(u);
    u.click();

    // block until one of these resolves
    await Promise.any([cl, ch]);

    // if the user sent a file then it's inside the 'u' HTML element
    // TODO feat: handle merging multiple .viz files!
    if (u.files && u.files.length === 1) {
      console.log('User requested file upload ', u.files[0]);
      document.body.removeChild(u); // cleanup
      const handle = u.files[0]; // 'u' is no longer part of the DOM but it's still in memory
      const content = await handle.text(); // get the text representation (UTF-8 only)
      console.log('Text representation: ', content)
      const pl = Handler3D.prepareLoad(content); // the PolygonData array in this file
      console.log('Object representation: ', pl)
      return pl
    }

    // TODO: two removeChild calls is dirty

    console.log("User cancelled file upload.")
    document.body.removeChild(u); // cleanup
    return null;
  }
}

export { Backend2D, Backend3D, ConvexGeometry, Storage };
