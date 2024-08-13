import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Edge, Point2D, Polygon2D } from "./classes.ts";
import { getIntersectionPolygon, IoU } from "./iou.ts";
const should = setupShould();

// Fuzzy