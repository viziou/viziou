/* API that is exposed to the front-end. */
import { PolygonData, PolyhedronData } from '../utils/types.tsx';
import { Point2D, Polygon2D } from './2D/classes.ts';
import { IoU, getIntersectionPolygon } from './2D/iou.ts';
import { BufferGeometry, Vector3 } from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { Handler as Handler2D, vLatest as vLatest2D } from './2D/PolygonFile.ts';
import { Handler as Handler3D, vLatest as vLatest3D } from './3D/PolyhedronFile.ts';

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
    const vertices: Point2D[] = [];
    for (let i = 0, l = geometryPosition.count; i < l; i+=3 ) {
      vertices.push(new Point2D(geometryPosition.array[i], geometryPosition.array[i + 1]));
    }
    return new Polygon2D(vertices, true);
  }

  private static _polygon2DtoThreeGeometry(polygon: Polygon2D): BufferGeometry  {
    const vertices: Vector3[] = [];
    polygon.vertices.forEach(({x, y}) => {
      vertices.push(new Vector3(x, y, 0));
    });
    return new ConvexGeometry(vertices);
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
