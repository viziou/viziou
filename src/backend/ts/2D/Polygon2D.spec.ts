import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Point2D, Polygon2D } from "./classes.ts";
import { nearlyEqual } from "./utils.ts";
const should = setupShould();


describe("Testing Class: Polygon2D", () => {
    it("Constructor", () => {
        // Check if vertices stored properly
        var points = [new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 4), new Point2D(0, 4)];
        var polygon = new Polygon2D(points);
        var result: boolean;
        for (var i = 0; i < points.length; i++) {
            result = polygon.vertices[i].equals(points[i]);
            result.should.equal(true);
        }

        // Check if a copy was appropriately made and no side effect can happen
        points[0] = new Point2D(0, 1);
        result = polygon.vertices[0].equals(new Point2D(0, 0));
        result.should.equal(true);
        result.should.not.equal(new Point2D(0, 1));

        // Create Polygon2D with sort enabled
        polygon = new Polygon2D(points, true);
        var sortedPoints = [new Point2D(2, 4), new Point2D(0, 4), new Point2D(0, 1), new Point2D(2, 0)];
        for (var i = 0; i < points.length; i++) {
            result = polygon.vertices[i].equals(sortedPoints[i]);
            result.should.equal(true);
        }
    });

    describe("Polygon.getCentroid()", () => {
        it("Basic #1 - Rectangle", () => {
            // Setup polygon
            var points = [new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 4), new Point2D(0, 4)];
            var polygon = new Polygon2D(points);
            var actualCentre = new Point2D(1, 2);
            var result = actualCentre.equals(polygon.getCentroid());
            result.should.equal(true);
        });

        it("Basic #2 - Octagon Centred at Origin", () => {
            // Setup octagon
            var points = [
                new Point2D(1, 0), 
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2), 
                new Point2D(0, 1), 
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            var polygon = new Polygon2D(points, true);
            var actualCentre = new Point2D(0, 0);
            var result = actualCentre.equals(polygon.getCentroid());
            result.should.equal(true);
        });
    });

    describe("Polygon2D.calculateArea()", () => {
        it("Basic #1 - Triangle", () => {
            // Setup polygon
            var points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(1, 3)];
            var polygon = new Polygon2D(points, true);
            var calculatedArea = polygon.calculateArea();
            var expectedArea = 15/2;
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Basic #2 - Rectangle", () => {
            // Setup polygon
            var points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(5, 2), new Point2D(0, 2)];
            var polygon = new Polygon2D(points, true);
            var calculatedArea = polygon.calculateArea();
            var expectedArea = 10;
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Basic #3 - Octagon", () => {
            // Setup octagon
            var points = [
                new Point2D(1, 0), 
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2), 
                new Point2D(0, 1), 
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            var polygon = new Polygon2D(points, true);
            var calculatedArea = polygon.calculateArea();
            calculatedArea.should.be.a('number');

            var expectedArea = 2*Math.sqrt(2);
            var areTheyEqual = nearlyEqual(calculatedArea, expectedArea);
            areTheyEqual.should.equal(true);
        });
        
        it("Complex #1", () => {
            // Setup polygon
            var points = [new Point2D(0, 0), new Point2D(9, 0), new Point2D(1, 6), new Point2D(0, 3)];
            var polygon = new Polygon2D(points, true);
            var calculatedArea = polygon.calculateArea();
            var expectedArea = 57/2;
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Complex #2", () => {
            var points = [new Point2D(1, 0), new Point2D(0, 1)];
            var polygon = new Polygon2D(points, true);
            var calculatedArea = polygon.calculateArea();
            var expectedArea = 0;
            should.exist(calculatedArea);
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Complex #3", () => {
            // Setup octagon
            var points = [
                new Point2D(1, 0), 
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2), 
                new Point2D(0, 1), 
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            var polygon = new Polygon2D(points, true);
            
            // Move octagon via map
            polygon = polygon.map((point) => {
                return new Point2D(point.x + 1000, point.y - 5000);
            })
            var calculatedArea = polygon.calculateArea();
            var expectedArea = 2*Math.sqrt(2);
            var areTheyEqual = nearlyEqual(calculatedArea, expectedArea);
            areTheyEqual.should.equal(true);
        });

        it("Complex #4", () => {
            // Setup octagon
            var points = [
                new Point2D(1, 0), 
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2), 
                new Point2D(0, 1), 
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            var polygon = new Polygon2D(points, true);
            
            // Move octagon via map (scaled by 2x in each direction, area should x4)
            polygon = polygon.map((point) => {
                return new Point2D(2*(point.x + 340), 2*(point.y + 17));
            })
            var calculatedArea = polygon.calculateArea();
            var expectedArea = 8*Math.sqrt(2);
            var areTheyEqual = nearlyEqual(calculatedArea, expectedArea);
            areTheyEqual.should.equal(true);
        });
    });

    describe("Polygon2D.contains()", () => {
        it(" ", () => {
            
        });
    });

    describe("Polygon2D.includes()", () => {
        it(" ", () => {
            
        });
    });

    describe("Polygon2D.map()", () => {
        it("Translation", () => {

        });

        it("No Side Effect", () => {

        });
    });
});