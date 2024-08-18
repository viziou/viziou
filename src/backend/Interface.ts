/* API that is exposed to the front-end. */
import { PolygonData } from '../utils/types';
import { Point2D, Polygon2D } from './ts/2D/classes'

class Backend2D {

  static area( { geometry }: PolygonData ) {
    const geometryPosition = geometry.getAttribute('position');
    const vertices: Point2D[] = [];
    for (let i = 0, l = geometryPosition.count; i < l; i+=3 ) {
        vertices.push(new Point2D(geometryPosition.array[i], geometryPosition.array[i + 1]));
    }
    //console.log(geometryPosition);
    //console.log(vertices)

    // create a backend polygon
    const polygon = new Polygon2D(vertices, true)
    return polygon.calculateArea()
  }

  static pointInPolygon({x, y}: { x: number; y: number }, { geometry }: PolygonData) {

  }

  static IoU({ geometry: geometry1 }: PolygonData, { geometry: geometry2 }: PolygonData) {

  }

  static centreOfMass({geometry, position}: PolygonData): {x: number; y: number} {
    const geometryPosition = geometry.getAttribute('position');
    const offset = new Point2D(position[0], position[1]);
    const vertices: Point2D[] = [];
    for (let i = 0, l = geometryPosition.count; i < l; i+=3 ) {
      vertices.push(new Point2D(geometryPosition.array[i], geometryPosition.array[i]));
    }

    // create backend polygon
    const polygon = new Polygon2D(vertices, true)
    return polygon.getCentroid().translate(offset).xy;
  }
}

export { Backend2D };
