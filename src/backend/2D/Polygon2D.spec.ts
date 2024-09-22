import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Point2D, Polygon2D } from "./classes.ts";
import { nearlyEqual } from "../utils.ts";
const should = setupShould();


describe("Testing Class: Polygon2D", () => {
    describe("Constructor", () => {
        it("Basic", () => {
            // Check if vertices stored properly
            const points = [new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 4), new Point2D(0, 4)];
            const polygon = new Polygon2D(points);
            let result: boolean;
            for (let i = 0; i < points.length; i++) {
                result = polygon.vertices[i].equals(points[i]);
                result.should.equal(true);
            }
        });

        it("Check for Side-Effect", () => {
            const points = [new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 4), new Point2D(0, 4)];
            const polygon = new Polygon2D(points);
            let result: boolean;
            const newPoint = new Point2D(0, 1);

            // Check if a copy was appropriately made and no side effect can happen
            points[0] = newPoint;
            result = polygon.vertices[0].equals(new Point2D(0, 0));
            result.should.equal(true);
            result.should.not.equal(newPoint);

            // Directly changing the return of polygon.vertices should also not change the internal
            polygon.vertices[0] = newPoint;
            result = polygon.vertices[0].equals(new Point2D(0, 0));
            result.should.equal(true);
            result.should.not.equal(newPoint);
        });

        it("Should sort when asked", () => {
            const points = [new Point2D(0, 1), new Point2D(2, 0), new Point2D(2, 4), new Point2D(0, 4)];
            let result: boolean;
            
            // Create Polygon2D with sort enabled
            const polygon = new Polygon2D(points, true);
            const sortedPoints = [new Point2D(2, 4), new Point2D(0, 4), new Point2D(0, 1), new Point2D(2, 0)];
            for (let i = 0; i < points.length; i++) {
                result = polygon.vertices[i].equals(sortedPoints[i]);
                result.should.equal(true);

                result = polygon.vertices[i].equals(points[i]);
                result.should.not.equal(true);
            }
        });

        it("Should not sort when asked not to", () => {
            const points = [new Point2D(0, 1), new Point2D(2, 0), new Point2D(2, 4), new Point2D(0, 4)];
            let result: boolean;
            
            // Create Polygon2D with sort explicitly disabled
            const polygon = new Polygon2D(points, false);
            const sortedPoints = [new Point2D(2, 4), new Point2D(0, 4), new Point2D(0, 1), new Point2D(2, 0)];
            for (let i = 0; i < points.length; i++) {
                result = polygon.vertices[i].equals(sortedPoints[i]);
                result.should.not.equal(true);

                result = polygon.vertices[i].equals(points[i]);
                result.should.equal(true);
            }
        });

        it("Should not sort by default", () => {
            const points = [new Point2D(0, 1), new Point2D(2, 0), new Point2D(2, 4), new Point2D(0, 4)];
            let result: boolean;
            
            // Create Polygon2D with sort disabled by default
            const polygon = new Polygon2D(points);
            const sortedPoints = [new Point2D(2, 4), new Point2D(0, 4), new Point2D(0, 1), new Point2D(2, 0)];
            for (let i = 0; i < points.length; i++) {
                result = polygon.vertices[i].equals(sortedPoints[i]);
                result.should.not.equal(true);

                result = polygon.vertices[i].equals(points[i]);
                result.should.equal(true);
            }
        });
    });

    describe("Polygon.centroid()", () => {
        it("Basic #1 - Rectangle", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(2, 0), new Point2D(2, 4), new Point2D(0, 4)];
            const polygon = new Polygon2D(points);
            const actualCentre = new Point2D(1, 2);
            const result = actualCentre.equals(polygon.centroid());
            result.should.equal(true);
        });

        it("Basic #2 - Octagon Centred at Origin", () => {
            // Setup octagon
            const points = [
                new Point2D(1, 0),
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(0, 1),
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            const polygon = new Polygon2D(points, true);
            const actualCentre = new Point2D(0, 0);
            const result = actualCentre.equals(polygon.centroid());
            result.should.equal(true);
        });
    });

    describe("Polygon2D.map()", () => {
        it("Translation", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(1, 3)];
            const polygon = new Polygon2D(points, true);
            const translationX = 7;
            const translationY = -8;
            const polygonTranslated = polygon.map((point) => {
                return new Point2D(point.x + translationX, point.y + translationY);
            })
            let pointMappedCorrectly: boolean;
            for (let i = 0; i < polygon.numVertices; i++) {
                pointMappedCorrectly = polygonTranslated.vertices[i].equals(new Point2D(polygon.vertices[i].x + translationX, polygon.vertices[i].y + translationY));
                pointMappedCorrectly.should.equal(true);
            }
        });

        it("Scaling", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(1, 3)];
            const polygon = new Polygon2D(points, true);
            const scaleFactor = 2;
            const polygonTranslated = polygon.map((point) => {
                return new Point2D(point.x*scaleFactor, point.y*scaleFactor);
            })
            let pointMappedCorrectly: boolean;
            for (let i = 0; i < polygon.numVertices; i++) {
                pointMappedCorrectly = polygonTranslated.vertices[i].equals(new Point2D(polygon.vertices[i].x*scaleFactor, polygon.vertices[i].y*scaleFactor));
                pointMappedCorrectly.should.equal(true);
            }
        });

        it("No Side Effect", () => {
            // Setup polygon
            const points = [new Point2D(1, 3), new Point2D(0, 0), new Point2D(5, 0)];
            const polygon = new Polygon2D(points, true);
            const translationX = 7;
            const translationY = -8;
            polygon.map((point) => {
                return new Point2D(point.x + translationX, point.y + translationY);
            })
            const referencePoint = new Point2D(8, -5);
            const originalPointUnchanged = !referencePoint.equals(polygon.vertices[0]) && polygon.vertices[0].equals(new Point2D(1, 3));
            originalPointUnchanged.should.equal(true);
        });
    });

    describe("Polygon2D.area()", () => {
        it("Basic #1 - Triangle", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(1, 3)];
            const polygon = new Polygon2D(points, true);
            const calculatedArea = polygon.area();
            const expectedArea = 15/2;
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Basic #2 - Rectangle", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(5, 2), new Point2D(0, 2)];
            const polygon = new Polygon2D(points, true);
            const calculatedArea = polygon.area();
            const expectedArea = 10;
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Basic #3 - Octagon", () => {
            // Setup octagon
            const points = [
                new Point2D(1, 0),
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(0, 1),
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            const polygon = new Polygon2D(points, true);
            const calculatedArea = polygon.area();
            calculatedArea.should.be.a('number');

            const expectedArea = 2*Math.sqrt(2);
            const areTheyEqual = nearlyEqual(calculatedArea, expectedArea);
            areTheyEqual.should.equal(true);
        });

        it("Complex #1", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(9, 0), new Point2D(1, 6), new Point2D(0, 3)];
            const polygon = new Polygon2D(points, true);
            const calculatedArea = polygon.area();
            const expectedArea = 57/2;
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Complex #2", () => {
            const points = [new Point2D(1, 0), new Point2D(0, 1)];
            const polygon = new Polygon2D(points, true);
            const calculatedArea = polygon.area();
            const expectedArea = 0;
            should.exist(calculatedArea);
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Complex #3", () => {
            // Setup octagon
            const points = [
                new Point2D(1, 0),
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(0, 1),
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            let polygon = new Polygon2D(points, true);

            // Move octagon via map
            polygon = polygon.map((point) => {
                return new Point2D(point.x + 1000, point.y - 5000);
            })
            const calculatedArea = polygon.area();
            const expectedArea = 2*Math.sqrt(2);
            const areTheyEqual = nearlyEqual(calculatedArea, expectedArea);
            areTheyEqual.should.equal(true);
        });

        it("Complex #4", () => {
            // Setup octagon
            const points = [
                new Point2D(1, 0),
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(0, 1),
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            let polygon = new Polygon2D(points, true);

            // Move octagon via map (scaled by 2x in each direction, area should x4)
            polygon = polygon.map((point) => {
                return new Point2D(2*(point.x + 340), 2*(point.y + 17));
            })
            const calculatedArea = polygon.area();
            const expectedArea = 8*Math.sqrt(2);
            const areTheyEqual = nearlyEqual(calculatedArea, expectedArea);
            areTheyEqual.should.equal(true);
        });

        describe("Null Behaviour #1 - Empty", () => {
          it("should be 0 (no sorting)", () => {
            const emptyPolygon = new Polygon2D([]);
            emptyPolygon.area().should.equal(0);
          });

          it("should be 0 (sorting)", () => {
            const emptyPolygon = new Polygon2D([], true);
            emptyPolygon.area().should.equal(0);
          })
        });

        describe("Null Behaviour #2 - Singular ", () => {
          it("should be 0 (no sort)", () => {
            const point = new Polygon2D([new Point2D(1, 2)]);
            point.area().should.equal(0)
          });

          it("should be 0 (sorting)", () => {
            const point = new Polygon2D([new Point2D(1, 2)], true);
            point.area().should.equal(0)
          });
        });

        describe("Null Behaviour #3 - Line", () => {
          it("should be 0 (no sort)", () => {
            const line = new Polygon2D([new Point2D(-1, 0), new Point2D(-1, 0)]);
            line.area().should.equal(0);
          })

          it("should be 0 (sorting)", () => {
            const line = new Polygon2D([new Point2D(-1, 0), new Point2D(-1, 0)], true);
            line.area().should.equal(0);
          })

        })
    });

    describe("Polygon2D.perimeter()", () => {
        it("Basic #1 - Triangle", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(1, 3)];
            const polygon = new Polygon2D(points, true);
            const calculatedPerimeter = polygon.perimeter();
            const expectedPerimeter = 10 + Math.sqrt(10);
            calculatedPerimeter.should.be.a('number');
            calculatedPerimeter.should.equal(expectedPerimeter);
        });

        it("Basic #2 - Rectangle", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(5, 2), new Point2D(0, 2)];
            const polygon = new Polygon2D(points, true);
            const calculatedPerimeter = polygon.perimeter();
            const expectedPerimeter = 14;
            calculatedPerimeter.should.be.a('number');
            calculatedPerimeter.should.equal(expectedPerimeter);
        });

        it("Basic #3 - Octagon", () => {
            // Setup octagon
            const points = [
                new Point2D(1, 0),
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(0, 1),
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            const polygon = new Polygon2D(points, true);
            const calculatedPerimeter = polygon.perimeter();
            calculatedPerimeter.should.be.a('number');

            const expectedPerimeter = 8*Math.sqrt(2-Math.SQRT2);
            const areTheyEqual = nearlyEqual(calculatedPerimeter, expectedPerimeter);
            areTheyEqual.should.equal(true);
        });
    });

    describe("Polygon2D.contains()", () => {
        it("Basic #1 - Does Contain", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(5, 2), new Point2D(0, 2)];
            const polygon = new Polygon2D(points, true);

            let isPointAVertex = polygon.contains(new Point2D(5, 0));
            isPointAVertex.should.be.a('boolean');
            isPointAVertex.should.equal(true);

            isPointAVertex = polygon.contains(new Point2D(0, 2));
            isPointAVertex.should.equal(true);
        });

        it("Basic #2 - Does Not Contain", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(5, 2), new Point2D(0, 2)];
            const polygon = new Polygon2D(points, true);

            let isPointAVertex = polygon.contains(new Point2D(5, 0.1));
            isPointAVertex.should.equal(false);

            isPointAVertex = polygon.contains(new Point2D(5, -0.1));
            isPointAVertex.should.equal(false);
        });
    });

    describe("Polygon2D.includes()", () => {
        it("Inside #1", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(5, 2), new Point2D(0, 2)];
            const polygon = new Polygon2D(points, true);
            const isPointInside = polygon.includes(new Point2D(1, 1));
            isPointInside.should.equal(true);
        });

        it("Inside #2", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(9, 0), new Point2D(1, 6), new Point2D(0, 3)];
            const polygon = new Polygon2D(points, true);
            const isPointInside = polygon.includes(new Point2D(2.5, 4.5));
            isPointInside.should.equal(true);
        });

        it("On Edge", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(9, 0), new Point2D(1, 6), new Point2D(0, 3)];
            const polygon = new Polygon2D(points, true);
            const isPointInside = polygon.includes(new Point2D(3, 4.5));
            isPointInside.should.equal(true);
        });

        it("On Vertex #1", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(1, 3)];
            const polygon = new Polygon2D(points, true);
            const isPointInside = polygon.includes(new Point2D(5, 0));
            isPointInside.should.equal(true);
        });

        it("On Vertex #2", () => {
            // Setup octagon
            const points = [
                new Point2D(1, 0),
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(0, 1),
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            let polygon = new Polygon2D(points, true);

            // Move octagon via map
            polygon = polygon.map((point) => {
                return new Point2D(point.x + 340, point.y + 17);
            })

            const isPointInside = polygon.includes(new Point2D(340, 18));
            isPointInside.should.equal(true);
        });

        it("Outside Left", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(9, 0), new Point2D(1, 6), new Point2D(0, 3)];
            const polygon = new Polygon2D(points, true);
            const isPointInside = polygon.includes(new Point2D(-2, 4));
            isPointInside.should.equal(false);
        });

        it("Outside Right", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(9, 0), new Point2D(1, 6), new Point2D(0, 3)];
            const polygon = new Polygon2D(points, true);
            const isPointInside = polygon.includes(new Point2D(8, 2));
            isPointInside.should.equal(false);
        });

        it("Outside Up", () => {
            // Setup octagon
            const points = [
                new Point2D(1, 0),
                new Point2D(Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(0, 1),
                new Point2D(-Math.sqrt(2)/2, Math.sqrt(2)/2),
                new Point2D(-1, 0),
                new Point2D(-Math.sqrt(2)/2, -Math.sqrt(2)/2),
                new Point2D(0, -1),
                new Point2D(Math.sqrt(2)/2, -Math.sqrt(2)/2)
            ];
            let polygon = new Polygon2D(points, true);

            // Move octagon via map
            polygon = polygon.map((point) => {
                return new Point2D(point.x + 340, point.y + 17);
            })

            const isPointInside = polygon.includes(new Point2D(340, 19));
            isPointInside.should.equal(false);
        });

        it("Outside Down", () => {
            // Setup polygon
            const points = [new Point2D(0, 0), new Point2D(5, 0), new Point2D(1, 3)];
            const polygon = new Polygon2D(points, true);
            const isPointInside = polygon.includes(new Point2D(2, -1));
            isPointInside.should.equal(false);
        });
    });
});