/* API that is exposed to the front-end. */
import { PolygonData, PolyhedronData } from '../utils/types';
import { Point2D, Polygon2D } from './ts/2D/classes';
import { IoU, getIntersectionPolygon } from './ts/2D/iou';
import { BufferGeometry, Vector3 } from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { Handler as Handler2D, vLatest as vLatest2D } from './ts/2D/PolygonFile.ts';
import { Handler as Handler3D, vLatest as vLatest3D } from './ts/3D/PolyhedronFile.ts';

class Backend2D {

  public static area( { geometry }: PolygonData ) {
    return this._threeGeometryToPolygon2D(geometry).calculateArea();
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
    return this._threeGeometryToPolygon2D(geometry).getCentroid().translate(offset).xy;
  }

  private static _threeGeometryToPolygon2D( geometry: BufferGeometry ): Polygon2D {
    const geometryPosition = geometry.getAttribute('position');
    let vertices: Point2D[] = [];
    const vertexSet: Set<{x: number, y: number}> = new Set();
    for (let i = 0, l = geometryPosition.count; i < l; i+=3 ) {
      //vertices.push(new Point2D(geometryPosition.array[i], geometryPosition.array[i + 1]));
      vertexSet.add({x: geometryPosition.array[i], y: geometryPosition.array[i + 1]});  // sets do not allow duplicates
    }
    vertexSet.forEach(({x, y}) => {
      vertices.push(new Point2D(x, y))
    })
    console.log('vertexSet: ', vertexSet);
    console.log('vertices: ', vertices)
    console.log('number of vertices parsed: ', geometryPosition.count / 3);
    console.log('number of vertices included: ', vertices.length)
    vertices = this._reducePointsToConvexHull(vertices);
    console.log('vertices after convex hull reduction: ', vertices);
    console.log('number of vertices on hull: ', vertices.length)
    return new Polygon2D(vertices, true);
  }

  private static _polygon2DtoThreeGeometry(polygon: Polygon2D): BufferGeometry  {
    const vertices: Vector3[] = [];
    polygon.vertices.forEach(({x, y}) => {
      vertices.push(new Vector3(x, y, 0));
    });
    return new ConvexGeometry(vertices);
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
     console.log('vertices after convex hull reduction: ', vertices);
     console.log('number of vertices on hull: ', vertices.length)
    return new Polygon2D(vertices, true);
  }

  private static _reducePointsToConvexHull(points: Point2D[]) {
    // This code is ugly as hell since there was so much debugging involved to get it working.
    //console.log('initial points: ', points);
    // Step 0: If you have a triangle (or less), there's nothing to do.
    if (points.length <= 3) return points;
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
    console.log('extremal point: ', extremalPointStart);
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
    console.log('points to the right: ', onRight);

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
        return { angle: (Math.acos(vector.y / vector.distanceToOrigin())), orig_idx: orig_idx };
      })
    }
    else {
      angles = onRight.map(({ point, orig_idx }) => {
        const vector = point.sub(reducedVertices[0]); // vector from extreme to this point
        //console.log(vector.x / vector.distanceToOrigin())
        return { angle: (Math.acos(vector.x / vector.distanceToOrigin())), orig_idx: orig_idx };
      })
    }
    console.log('angles on the right: ', angles);
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
    console.log('current wrap (after initial point): ', reducedVertices);

    // Step 3: Now that we have a vector that is on the convex hull, we can brute-force a solution by continually
    // maximising the angle between this vector (which just an edge) and our next edge.
    let finished = false;
    while (!finished) {
      const angles = points.map((point, index) => {
        const vector_behind = reducedVertices[reducedVertices.length - 1].sub(reducedVertices[reducedVertices.length - 2]) // recover previous vector
        const vector = reducedVertices[reducedVertices.length - 1].sub(point) // calculate this vector
        console.log('inside next angle: ', vector.x / vector.distanceToOrigin());
        return {angle: Math.acos(vector_behind.dot(vector) / (vector_behind.distanceToOrigin() * vector.distanceToOrigin())), orig_idx: index}
      });
      console.log('current wrap: ', reducedVertices);
      console.log('next angles: ', angles);
      let max_angle = 0;
      let max_angle_index = 0
      for (const {orig_idx, angle} of angles) {
        // search for maximum angle
        if (angle > max_angle) {
          max_angle = angle;
          max_angle_index = orig_idx;

        }
        }
        console.log('determined that the next point is ', points[max_angle_index], ' with angle ', max_angle)
      // if we come back to the start then that's a wrap (literally)
      if (max_angle_index === extramalPointIndex) {
        console.log('final max angle: ', max_angle, ' occurred at: ', max_angle_index);
        finished = true;
      } else {
        reducedVertices.push(points[max_angle_index]);
        }
      }
    return reducedVertices;
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

export { Backend2D, Storage };
