// import { Point2D, Edge, Polygon2D } from "./classes.ts";
import { nearlyEqual } from "../utils.ts";

// Setup polygon
// var points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(1, 3)];
// var polygon = new Polygon2D(points, true);
// var translationX = 7;
// var translationY = -8;
// var a = polygon.map((point) => {
//     return new Point2D(point.x + translationX, point.y + translationY);
// })
// var referencePoint = new Point2D(7, -8);
// var originalPointUnchanged = !referencePoint.equals(polygon.vertices[0]) && polygon.vertices[0].equals(new Point2D(0, 0));
// console.log(originalPointUnchanged);

console.log(nearlyEqual(3, 4))