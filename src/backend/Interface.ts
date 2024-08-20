/* API that is exposed to the front-end. */
import { PolygonData } from '../utils/types';
import { Point2D, Polygon2D } from './ts/2D/classes';
import { IoU, getIntersectionPolygon } from './ts/2D/iou';
import { BufferGeometry, Vector3 } from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

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

export { Backend2D };
