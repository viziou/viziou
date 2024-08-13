import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Edge, Point2D } from "./classes.ts";
const should = setupShould();


describe("Testing Class: Point2D", () => {
    it("Constructor", () => {
        var x = 3;
        var y = 4;
        var point = new Point2D(x, y);
        point.x.should.be.a('number');
        point.y.should.be.a('number');
        point.x.should.equal(x);
        point.y.should.equal(y);
        should.exist(point);
    });

    describe("Point2D.equal()", () => {
        it("Basic #1", () => {
            // Setup Point2D objects
            var point1 = new Point2D(3, 4);
            var point2 = new Point2D(-1, -8);

            var result = point1.equals(point2);
            result.should.be.a('boolean');
            result.should.equal(false);
            should.exist(result);
        });

        it("Basic #2", () => {
            // Setup Point2D objects
            var point1 = new Point2D(3, 4);
            var point2 = new Point2D(3, 5);

            var result = point1.equals(point2);
            result.should.be.a('boolean');
            result.should.equal(false);
            should.exist(result);
        });

        it("Identity", () => {
            // Setup Point2D objects
            var point1 = new Point2D(3, 4);

            var result = point1.equals(point1);
            result.should.equal(true);
        });

        it("Commutative", () => {
            // Setup Point2D objects
            var point1 = new Point2D(3, 4);
            var point2 = new Point2D(6, 7);
            var point3 = new Point2D(4, -1);
            var point4 = new Point2D(4, -1);

            var result1 = point1.equals(point2);
            var result2 = point2.equals(point1);
            result1.should.equal(result2);

            var result3 = point3.equals(point4);
            var result4 = point4.equals(point3);
            result3.should.equal(result4);
        });

        it("Transitive", () => {
            // Setup Point2D objects
            var point1 = new Point2D(3, 4);
            var point2 = new Point2D(3, 4);
            var point3 = new Point2D(3, 4);

            var result1 = point1.equals(point2);
            var result2 = point2.equals(point3);
            var result3 = point3.equals(point1);
            result1.should.equal(result2);
            result2.should.equal(result3);
            result3.should.equal(result1);
        });

        it("Nearly #1", () => {
            // Setup Point2D objects
            var point1 = new Point2D(3, 4);
            var point2 = new Point2D(3.00001, 3.999999);

            var result = point1.equals(point2);
            result.should.equal(false);
        });

        it("Nearly #2", () => {
            // Setup Point2D objects
            var point1 = new Point2D(3, 4);
            var point2 = new Point2D(3.0000000000001, 4.0000000000001);

            var result = point1.equals(point2);
            result.should.equal(true);
        });
    });

    describe("Point2D.onEdgeSegment()", () => {
        it("Not on Edge #1 - Obvious", () => {
            var point = new Point2D(-1, 8);
            var edge: Edge = {
                p: new Point2D(2, 3),
                q: new Point2D(7, 1)
            };
            var result = point.onEdgeSegment(edge);
            result.should.equal(false);
        });

        it("Not on Edge #2 - Within Bounds", () => {
            var point = new Point2D(5, 2);
            var edge: Edge = {
                p: new Point2D(2, 3),
                q: new Point2D(7, 1)
            };
            var result = point.onEdgeSegment(edge);
            result.should.equal(false);
        });

        it("Not on Edge #3 - Fractions", () => {
            var point = new Point2D(-3/7, 447/99);
            var edge: Edge = {
                p: new Point2D(-5, 15/2),
                q: new Point2D(2, 3)
            };
            var result = point.onEdgeSegment(edge);
            result.should.equal(false);
        });

        it("On Edge #1 - Obvious", () => {
            var point = new Point2D(3, 4);
            var edge1: Edge = {
                p: new Point2D(2, 3),
                q: new Point2D(4, 5)
            };
            var edge2: Edge = {
                p: new Point2D(4, 5),
                q: new Point2D(2, 3)
            };
            var result = point.onEdgeSegment(edge1);
            result.should.equal(true);
            result = point.onEdgeSegment(edge2);
            result.should.equal(true);
        });

        it("On Edge #2 - Endpoint", () => {
            var point1 = new Point2D(-2, 3);
            var point2 = new Point2D(4, -5);
            var edge: Edge = {
                p: new Point2D(-2, 3),
                q: new Point2D(4, -5)
            };
            var result = point1.onEdgeSegment(edge);
            result.should.equal(true);
            result = point2.onEdgeSegment(edge);
            result.should.equal(true);
        });

        it("On Edge #3 - Fractions", () => {
            var point = new Point2D(-3/7, 447/98);
            var edge: Edge = {
                p: new Point2D(-5, 15/2),
                q: new Point2D(2, 3)
            };
            var result = point.onEdgeSegment(edge);
            result.should.equal(true);
        });
    });
});