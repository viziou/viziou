import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Edge2D, Point2D } from "./classes.ts";
const should = setupShould();


describe("Testing Class: Point2D", () => {
    it("Constructor", () => {
        const x = 3;
        const y = 4;
        const point = new Point2D(x, y);
        point.x.should.be.a('number');
        point.y.should.be.a('number');
        point.x.should.equal(x);
        point.y.should.equal(y);
        should.exist(point);
    });

    describe("Point2D.equal()", () => {
        it("Basic #1", () => {
            // Setup Point2D objects
            const point1 = new Point2D(3, 4);
            const point2 = new Point2D(-1, -8);

            const result = point1.equals(point2);
            result.should.be.a('boolean');
            result.should.equal(false);
            should.exist(result);
        });

        it("Basic #2", () => {
            // Setup Point2D objects
            const point1 = new Point2D(3, 4);
            const point2 = new Point2D(3, 5);

            const result = point1.equals(point2);
            result.should.be.a('boolean');
            result.should.equal(false);
            should.exist(result);
        });

        it("Identity", () => {
            // Setup Point2D objects
            const point1 = new Point2D(3, 4);

            const result = point1.equals(point1);
            result.should.equal(true);
        });

        it("Commutative", () => {
            // Setup Point2D objects
            const point1 = new Point2D(3, 4);
            const point2 = new Point2D(6, 7);
            const point3 = new Point2D(4, -1);
            const point4 = new Point2D(4, -1);

            const result1 = point1.equals(point2);
            const result2 = point2.equals(point1);
            result1.should.equal(result2);

            const result3 = point3.equals(point4);
            const result4 = point4.equals(point3);
            result3.should.equal(result4);
        });

        it("Transitive", () => {
            // Setup Point2D objects
            const point1 = new Point2D(3, 4);
            const point2 = new Point2D(3, 4);
            const point3 = new Point2D(3, 4);

            const result1 = point1.equals(point2);
            const result2 = point2.equals(point3);
            const result3 = point3.equals(point1);
            result1.should.equal(result2);
            result2.should.equal(result3);
            result3.should.equal(result1);
        });

        it("Nearly #1", () => {
            // Setup Point2D objects
            const point1 = new Point2D(3, 4);
            const point2 = new Point2D(3.00001, 3.999999);

            const result = point1.equals(point2);
            result.should.equal(false);
        });

        it("Nearly #2", () => {
            // Setup Point2D objects
            const point1 = new Point2D(3, 4);
            const point2 = new Point2D(3.0000000000001, 4.0000000000001);

            const result = point1.equals(point2);
            result.should.equal(true);
        });
    });

    describe("Point2D.onEdgeSegment()", () => {
        it("Not on Edge #1 - Obvious", () => {
            const point = new Point2D(-1, 8);
            const edge: Edge2D = {
                p: new Point2D(2, 3),
                q: new Point2D(7, 1)
            };
            const result = point.onEdgeSegment(edge);
            result.should.equal(false);
        });

        it("Not on Edge #2 - Within Bounds", () => {
            const point = new Point2D(5, 2);
            const edge: Edge2D = {
                p: new Point2D(2, 3),
                q: new Point2D(7, 1)
            };
            const result = point.onEdgeSegment(edge);
            result.should.equal(false);
        });

        it("Not on Edge #3 - Fractions", () => {
            const point = new Point2D(-3/7, 447/99);
            const edge: Edge2D = {
                p: new Point2D(-5, 15/2),
                q: new Point2D(2, 3)
            };
            const result = point.onEdgeSegment(edge);
            result.should.equal(false);
        });

        it("On Edge #1 - Obvious", () => {
            const point = new Point2D(3, 4);
            const edge1: Edge2D = {
                p: new Point2D(2, 3),
                q: new Point2D(4, 5)
            };
            const edge2: Edge2D = {
                p: new Point2D(4, 5),
                q: new Point2D(2, 3)
            };
            let result = point.onEdgeSegment(edge1);
            result.should.equal(true);
            result = point.onEdgeSegment(edge2);
            result.should.equal(true);
        });

        it("On Edge #2 - Endpoint", () => {
            const point1 = new Point2D(-2, 3);
            const point2 = new Point2D(4, -5);
            const edge: Edge2D = {
                p: new Point2D(-2, 3),
                q: new Point2D(4, -5)
            };
            let result = point1.onEdgeSegment(edge);
            result.should.equal(true);
            result = point2.onEdgeSegment(edge);
            result.should.equal(true);
        });

        it("On Edge #3 - Fractions", () => {
            const point = new Point2D(-3/7, 447/98);
            const edge: Edge2D = {
                p: new Point2D(-5, 15/2),
                q: new Point2D(2, 3)
            };
            const result = point.onEdgeSegment(edge);
            result.should.equal(true);
        });
    });
});