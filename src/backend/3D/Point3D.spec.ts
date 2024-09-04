import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Edge3D, Point3D } from "./classes.ts";
const should = setupShould();


describe("Testing Class: Point3D", () => {
    it("Constructor", () => {
        const x = 3;
        const y = 4;
        const z = 5;
        const point = new Point3D(x, y, z);
        point.x.should.be.a('number');
        point.y.should.be.a('number');
        point.z.should.be.a('number');
        point.x.should.equal(x);
        point.y.should.equal(y);
        point.z.should.equal(z);
        should.exist(point);
    });

    describe("Point3D.equal()", () => {
        it("Basic #1", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 5);
            const point2 = new Point3D(-1, -8, 0);

            const result = point1.equals(point2);
            result.should.be.a('boolean');
            result.should.equal(false);
            should.exist(result);
        });

        it("Basic #2", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 0);
            const point2 = new Point3D(3, 5, 0);

            const result = point1.equals(point2);
            result.should.be.a('boolean');
            result.should.equal(false);
            should.exist(result);
        });

        it("Identity", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 5);

            const result = point1.equals(point1);
            result.should.equal(true);
        });

        it("Commutative", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 1);
            const point2 = new Point3D(6, 7, 1);
            const point3 = new Point3D(4, -1, 0);
            const point4 = new Point3D(4, -1, 0);

            const result1 = point1.equals(point2);
            const result2 = point2.equals(point1);
            result1.should.equal(result2);

            const result3 = point3.equals(point4);
            const result4 = point4.equals(point3);
            result3.should.equal(result4);
        });

        it("Transitive", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 5);
            const point2 = new Point3D(3, 4, 5);
            const point3 = new Point3D(3, 4, 5);

            const result1 = point1.equals(point2);
            const result2 = point2.equals(point3);
            const result3 = point3.equals(point1);
            result1.should.equal(result2);
            result2.should.equal(result3);
            result3.should.equal(result1);
        });

        it("Nearly #1", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 0);
            const point2 = new Point3D(3.00001, 3.999999, -0.000000000000001);

            const result = point1.equals(point2);
            result.should.equal(false);
        });

        it("Nearly #2", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 0);
            const point2 = new Point3D(3.0000000000001, 4.0000000000001, -0.000000000000001);

            const result = point1.equals(point2);
            result.should.equal(true);
        });
    });

    describe("Point3D.add()", () => {
        it("Basic #1", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 5);
            const point2 = new Point3D(1, 1, 1);
            const point3 = new Point3D(4, 5, 6);

            const result = point3.equals(point1.add(point2));
            result.should.be.a('boolean');
            result.should.equal(true);
            should.exist(result);
        });

        it("Basic #2", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, Math.sqrt(2));
            const point2 = new Point3D(-1, 4/5, Math.sqrt(2));
            const point3 = new Point3D(2, 24/5, 2*Math.sqrt(2));

            const result = point3.equals(point1.add(point2));
            result.should.be.a('boolean');
            result.should.equal(true);
            should.exist(result);
        });
    });

    describe("Point3D.subtract()", () => {
        it("Basic #1", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 5);
            const point2 = new Point3D(1, 1, 1);
            const point3 = new Point3D(2, 3, 4);

            const result = point3.equals(point1.subtract(point2));
            result.should.be.a('boolean');
            result.should.equal(true);
            should.exist(result);
        });

        it("Basic #2", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, Math.sqrt(2));
            const point2 = new Point3D(-1, 4/5, Math.sqrt(2));
            const point3 = new Point3D(4, 16/5, 0);

            const result = point3.equals(point1.subtract(point2));
            result.should.be.a('boolean');
            result.should.equal(true);
            should.exist(result);
        });
    });

    describe("Point3D.magnitude()", () => {
        it("Basic #1", () => {
            // Setup Point3D objects
            const point1 = new Point3D(1, 1, 1);

            point1.magnitude().should.be.a('number');
            point1.magnitude().should.equal(Math.sqrt(3));
        });

        it("Basic #2", () => {
            // Setup Point3D objects
            const point1 = new Point3D(-3, 4, 0);

            point1.magnitude().should.be.a('number');
            point1.magnitude().should.equal(5);
        });
    });

    describe("Point3D.normalise()", () => {
        it("Basic #1", () => {
            // Setup Point3D objects
            const point1 = new Point3D(1000000, 0, 0);
            const point2 = new Point3D(1, 0, 0);

            const result = point1.normalise().equals(point2);
            result.should.be.a('boolean');
            result.should.equal(true);
            should.exist(result);
        });

        it("Basic #2", () => {
            // Setup Point3D objects
            const point1 = new Point3D(-10000, 0, 0);
            const point2 = new Point3D(-1, 0, 0);

            const result = point1.normalise().equals(point2);
            result.should.be.a('boolean');
            result.should.equal(true);
            should.exist(result);
        });

        it("Basic #3", () => {
            // Setup Point3D objects
            const point1 = new Point3D(3, 4, 5);
            const point2 = new Point3D(3/(5*Math.SQRT2), 4/(5*Math.SQRT2), Math.SQRT1_2);

            const result = point1.normalise().equals(point2);
            result.should.be.a('boolean');
            result.should.equal(true);
            should.exist(result);
        });
    });

    describe("Point3D.onEdgeSegment()", () => {
        it("Not on Edge #1 - Obvious", () => {
            const point = new Point3D(-1, 8, 9);
            const edge: Edge3D = {
                p: new Point3D(2, 3, 0),
                q: new Point3D(7, 1, 1)
            };
            const result = point.onEdgeSegment(edge);
            result.should.equal(false);
        });

        it("Not on Edge #2 - Within Bounds", () => {
            const point = new Point3D(5, 2, 16);
            const edge: Edge3D = {
                p: new Point3D(2, 3, 12),
                q: new Point3D(7, 1, 20)
            };
            const result = point.onEdgeSegment(edge);
            result.should.equal(false);
        });

        it("Not on Edge #3 - Fractions", () => {
            const point = new Point3D(-3/7, 447/99, 3/4);
            const edge: Edge3D = {
                p: new Point3D(-5, 15/2, 1/2),
                q: new Point3D(2, 3, 1)
            };
            const result = point.onEdgeSegment(edge);
            result.should.equal(false);
        });

        it("On Edge #1 - Obvious", () => {
            const point = new Point3D(3, 4, -2);
            const edge1: Edge3D = {
                p: new Point3D(2, 3, -3),
                q: new Point3D(4, 5, -1)
            };
            const edge2: Edge3D = {
                p: new Point3D(4, 5, -1),
                q: new Point3D(2, 3, -3)
            };
            let result = point.onEdgeSegment(edge1);
            result.should.equal(true);
            result = point.onEdgeSegment(edge2);
            result.should.equal(true);
        });

        it("On Edge #2 - Endpoint", () => {
            const point1 = new Point3D(-2, 3, 0);
            const point2 = new Point3D(4, -5, 1);
            const edge: Edge3D = {
                p: point1,
                q: point2
            };
            let result = point1.onEdgeSegment(edge);
            result.should.equal(true);
            result = point2.onEdgeSegment(edge);
            result.should.equal(true);
        });

        it("On Edge #3 - Fractions", () => {
            const point = new Point3D(-3/7, 447/98, 971/1764);
            const edge: Edge3D = {
                p: new Point3D(-5, 15/2, 3/4),
                q: new Point3D(2, 3, 4/9)
            };
            const result = point.onEdgeSegment(edge);
            result.should.equal(true);
        });
    });
});