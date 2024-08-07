import { Point2D, Polygon2D } from "./classes.ts";

// 4 x 4 square
var x = new Polygon2D([new Point2D(0, 0), new Point2D(4, 0), new Point2D(4, 4), new Point2D(0, 4)]);
var area = x.calculateArea();
console.log(area);  // Expecting 16