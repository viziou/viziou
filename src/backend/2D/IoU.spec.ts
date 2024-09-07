import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Point2D, Polygon2D } from "./classes.ts";
import { getIntersectionPolygon, IoU } from "./iou.ts";
import { nearlyEqual } from "../utils.ts";
const should = setupShould();

describe("Testing getIntersectingPolygon()", () => {
    it("No Intersection", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(3, 1), new Point2D(3, 2), new Point2D(4, 2), new Point2D(4, 1)], true);
        const trueIntersectPolygon = new Polygon2D([]);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon2);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(trueIntersectPolygon.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(trueIntersectPolygon.vertices[i]);
            result.should.equal(true);
        }
    });

    it("Polygon Encompasses Polygon", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(0.5, 1), new Point2D(0.5, 2), new Point2D(1.5, 2), new Point2D(1.5, 1)], true);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon2);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(polygon2.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(polygon2.vertices[i]);
            result.should.equal(true);
        }
    });

    it("Identical Polygons", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon1);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(polygon1.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(polygon1.vertices[i]);
            result.should.equal(true);
        }
    });

    it("Single Full Edge", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(2, 0), new Point2D(2, 6), new Point2D(3, 6), new Point2D(3, 1)], true);
        const trueIntersectPolygon = new Polygon2D([new Point2D(2, 0), new Point2D(2, 6)], true);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon2);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(trueIntersectPolygon.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(trueIntersectPolygon.vertices[i]);
            result.should.equal(true);
        }
    });

    it("Single Partial Edge", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(2, 2), new Point2D(2, 2.2), new Point2D(3, 6), new Point2D(3, 1)], true);
        const trueIntersectPolygon = new Polygon2D([new Point2D(2, 2), new Point2D(2, 2.2)], true);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon2);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(trueIntersectPolygon.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(trueIntersectPolygon.vertices[i]);
            result.should.equal(true);
        }
    });

    it("Single Vertex on Edge", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(2, 2.2), new Point2D(3, 6), new Point2D(3, 1)], true);
        const trueIntersectPolygon = new Polygon2D([new Point2D(2, 2.2)], true);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon2);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(trueIntersectPolygon.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(trueIntersectPolygon.vertices[i]);
            result.should.equal(true);
        }
    });

    it("Single Vertex on Vertex", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(2, 6), new Point2D(3, 6), new Point2D(3, 1)], true);
        const trueIntersectPolygon = new Polygon2D([new Point2D(2, 6)], true);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon2);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(trueIntersectPolygon.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(trueIntersectPolygon.vertices[i]);
            result.should.equal(true);
        }
    });

    it("Intersecting Rectangle", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(1, 1), new Point2D(4, 1), new Point2D(4, -2), new Point2D(1, -2)], true);
        const trueIntersectPolygon = new Polygon2D([new Point2D(1, 0), new Point2D(2, 0), new Point2D(2, 1), new Point2D(1, 1)], true);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon2);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(trueIntersectPolygon.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(trueIntersectPolygon.vertices[i]);
            result.should.equal(true);
        }
    });

    it("Intersecting Triangles", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 4), new Point2D(2, 0), new Point2D(4, 4)], true);
        const polygon2 = new Polygon2D([new Point2D(0, -2), new Point2D(2, 1), new Point2D(4, -2)], true);
        const trueIntersectPolygon = new Polygon2D([new Point2D(2, 0), new Point2D(2, 1), new Point2D(12/7, 4/7), new Point2D(16/7, 4/7)], true);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon2);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(trueIntersectPolygon.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(trueIntersectPolygon.vertices[i]);
            result.should.equal(true);
        }
    });

    it("Complex Polygons", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 4), new Point2D(1, -7), new Point2D(4, -9), new Point2D(8, -3), new Point2D(4, 1.5)], true);
        const polygon2 = new Polygon2D([new Point2D(0, -2), new Point2D(1, 8), new Point2D(14, 4), new Point2D(12, 1), new Point2D(1, -3)], true);
        const trueIntersectPolygon = new Polygon2D([new Point2D(1, -3), new Point2D(3/5, -13/5), new Point2D(2/7, 6/7), new Point2D(48/85, 62/17), new Point2D(4, 1.5), new Point2D(824/131, -141/131)], true);
        const resultIntersectPolygon = getIntersectionPolygon(polygon1, polygon2);

        // Both polygons should have same number of vertices
        resultIntersectPolygon.numVertices.should.equal(trueIntersectPolygon.numVertices);

        // Both polygons should have exact same vertices in sorted manner
        let result: boolean;
        for (let i = 0; i < resultIntersectPolygon.numVertices; i++) {
            result = resultIntersectPolygon.vertices[i].equals(trueIntersectPolygon.vertices[i]);
            result.should.equal(true);
        }
    });
});

describe("Testing 2D IoU Functionality", () => {
    it("Commutativity Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(1, 1), new Point2D(4, 1), new Point2D(4, -2), new Point2D(1, -2)], true);
        const iou12 = IoU(polygon1, polygon2);
        const iou21 = IoU(polygon2, polygon1);

        should.exist(iou12);
        iou12.should.be.a('number');

        should.exist(iou21);
        iou21.should.be.a('number');

        iou12.should.equal(iou21);
    });

    it("Identity Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const iou = IoU(polygon1, polygon1);

        should.exist(iou);
        iou.should.be.a('number');

        iou.should.equal(1);
    });

    it("Polygon Encompasses Polygon Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(0.5, 1), new Point2D(0.5, 2), new Point2D(1.5, 2), new Point2D(1.5, 1)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(polygon2.area()/polygon1.area());
    });

    it("No Intersection Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(3, 1), new Point2D(3, 2), new Point2D(4, 2), new Point2D(4, 1)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(0);
    });

    it("No Union Test #1", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0)], true);
        const polygon2 = new Polygon2D([new Point2D(3, 1), new Point2D(4, 1)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(0);
    });

    it("No Union Test #2", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0)], true);
        const polygon2 = new Polygon2D([new Point2D(0, -1), new Point2D(0, 1)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(0);
    });

    it("No Union Test #3", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(0, 1)], true);
        const polygon2 = new Polygon2D([new Point2D(0, -1), new Point2D(0, 2)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(0);
    });

    it("Single Vertex-Edge Intersection Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(2, 2.2), new Point2D(3, 6), new Point2D(3, 1)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(0);
    });

    it("Single Vertex-Vertex Intersection Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(2, 6), new Point2D(3, 6), new Point2D(3, 1)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(0);
    });

    it("Full Edge Intersection Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(2, 0), new Point2D(2, 6), new Point2D(3, 6), new Point2D(3, 1)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(0);
    });

    it("Partial Edge Intersection Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 6), new Point2D(0, 6)], true);
        const polygon2 = new Polygon2D([new Point2D(2, 2), new Point2D(2, 2.2), new Point2D(3, 6), new Point2D(3, 1)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(0);
    });

    it("Polygon w/ < 3 Vertices Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 4), new Point2D(2, 0), new Point2D(4, 4)], true);
        const polygon2 = new Polygon2D([new Point2D(0, 0), new Point2D(2, 2.5)], true);
        const iou = IoU(polygon1, polygon2);
        iou.should.equal(0);
    });

    it("Complex IoU Test", () => {
        const polygon1 = new Polygon2D([new Point2D(0, 4), new Point2D(1, -7), new Point2D(4, -9), new Point2D(8, -3), new Point2D(4, 1.5)], true);
        const polygon2 = new Polygon2D([new Point2D(0, -2), new Point2D(1, 8), new Point2D(14, 4), new Point2D(12, 1), new Point2D(1, -3)], true);
        const iou = IoU(polygon1, polygon2);

        const expectedPolygon1Area = 115/2;
        const expectedPolygon2Area = 179/2;
        const expectedIntersectionArea = 3449877/155890;

        let result: boolean;
        result = nearlyEqual(polygon1.area(), expectedPolygon1Area);
        result.should.equal(true);
        result = nearlyEqual(polygon2.area(), expectedPolygon2Area);
        result.should.equal(true);
        result = nearlyEqual(getIntersectionPolygon(polygon1, polygon2).area(), expectedIntersectionArea);
        result.should.equal(true);

        const expectedIoU = 1149959/6488651;
        iou.should.equal(expectedIoU);  // Missing nearlyEqual but will keep as is
    });
});