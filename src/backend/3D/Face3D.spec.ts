import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Point3D, Face3D } from "./classes.ts";
setupShould();


describe("Testing Class: Face3D", () => {
    describe("Constructor", () => {
        it("Basic", () => {
            // Check if vertices stored properly
            const points = [new Point3D(0, 0, 0), new Point3D(2, 0, 0), new Point3D(2, 4, 1), new Point3D(0, 4, 1)];
            const face = new Face3D(points);
            let result: boolean;
            for (let i = 0; i < points.length; i++) {
                result = face.vertices[i].equals(points[i]);
                result.should.equal(true);
            }
        });

        it("Check for Side-Effect", () => {
            const points = [new Point3D(0, 0, 0), new Point3D(2, 0, 0), new Point3D(2, 4, 1), new Point3D(0, 4, 1)];
            const face = new Face3D(points);
            let result: boolean;
            const newPoint = new Point3D(0, 1, 0);

            // Check if a copy was appropriately made and no side effect can happen
            points[0] = newPoint;
            result = face.vertices[0].equals(new Point3D(0, 0, 0));
            result.should.equal(true);
            face.vertices[0].should.not.equal(newPoint);

            // Directly changing the return of face.vertices should also not change the internal
            face.vertices[0] = newPoint;
            result = face.vertices[0].equals(new Point3D(0, 0, 0));
            result.should.equal(true);
            face.vertices[0].should.not.equal(newPoint);
        });

        it("Should sort when asked", () => {
            const points = [new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(0, 0, 1)];
            let result: boolean;
            
            // Create Face3D with sort enabled
            const face = new Face3D(points, true, true);
            const sortedPoints = [new Point3D(0, 1, 1), new Point3D(0, 0, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0)];
            for (let i = 0; i < points.length; i++) {
                result = face.vertices[i].equals(sortedPoints[i]);
                result.should.equal(true);
            }
        });

        it("Should not sort when asked not to", () => {
            const points = [new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(0, 0, 1)];
            let result: boolean;
            
            // Create Face3D with sort disabled
            const face = new Face3D(points, true, false);
            for (let i = 1; i < points.length; i++) {
                result = face.vertices[i].equals(points[i]);
                result.should.equal(true);
            }
        });

        it("Should not sort by default", () => {
            const points = [new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(0, 0, 1)];
            let result: boolean;
            
            // Create Face3D with sort disabled by default
            const face = new Face3D(points, true);
            for (let i = 1; i < points.length; i++) {
                result = face.vertices[i].equals(points[i]);
                result.should.equal(true);
            }
        });

        it("Should validate when asked", () => {
            const points1 = [new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(0, 0, 1)];
            
            // Create Face3D with validate enabled
            const face1 = new Face3D(points1, true);

            // Face was valid hence all vertices should be tracked
            face1.vertices.length.should.equal(4);

            const points2 = [new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(1, 0, 1)];
            
            // Create Face3D with validate enabled
            const face2 = new Face3D(points2, true);

            // Face was invalid hence no vertices should be tracked
            face2.vertices.length.should.equal(0);
        });

        it("Should not validate when asked not to", () => {
            const points1 = [new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(0, 0, 1)];
            
            // Create Face3D with validate disabled
            const face1 = new Face3D(points1, false);

            // Should not validate and accept all 4 vertices
            face1.vertices.length.should.equal(4);

            const points2 = [new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(1, 0, 1)];
            
            // Create Face3D with validate disabled
            const face2 = new Face3D(points2, false);

            // Should not validate and accept all 4 vertices
            face2.vertices.length.should.equal(4);
        });

        it("Should not validate by default", () => {
            const points1 = [new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(0, 0, 1)];
            
            // Create Face3D with validate disabled by default
            const face1 = new Face3D(points1);

            // Should not validate and accept all 4 vertices
            face1.vertices.length.should.equal(4);

            const points2 = [new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(1, 0, 1)];
            
            // Create Face3D with validate disabled by default
            const face2 = new Face3D(points2);

            // Should not validate and accept all 4 vertices
            face2.vertices.length.should.equal(4);
        });
    });

    describe("Face3D.centroid()", () => {
        it("Basic #1 - Rectangle", () => {
            // Setup face
            const points = [new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(4, 0, 2), new Point3D(4, 1, 2)];
            const face = new Face3D(points, true, true);
            const actualCentre = new Point3D(2, 1/2, 1);
            const result = actualCentre.equals(face.centroid());
            result.should.equal(true);
        });

        it("Basic #2 - Tilted Triangle", () => {
            // Setup face
            const points = [new Point3D(1, 1, 9), new Point3D(2, -2, 0), new Point3D(6, 4, 0)];
            const face = new Face3D(points, true, true);
            const actualCentre = new Point3D(3, 1, 3);
            const result = actualCentre.equals(face.centroid());
            result.should.equal(true);
        });
    });

    describe("Face3D.map()", () => {
        it("Translation", () => {
            // Setup polygon
            const points = [new Point3D(0, 0, 0), new Point3D(5, 0, 0), new Point3D(1, 3, 4)];
            const face = new Face3D(points, true, true);
            const translationX = 7;
            const translationY = -8;
            const translationZ = 1;
            const faceTranslated = face.map((point) => {
                return new Point3D(point.x + translationX, point.y + translationY, point.z + translationZ);
            })
            let pointMappedCorrectly: boolean;
            for (let i = 0; i < face.numVertices; i++) {
                pointMappedCorrectly = faceTranslated.vertices[i].equals(new Point3D(face.vertices[i].x + translationX, face.vertices[i].y + translationY, face.vertices[i].z + translationZ));
                pointMappedCorrectly.should.equal(true);
            }
        });

        it("Scaling", () => {
            // Setup polygon
            const points = [new Point3D(0, 0, 0), new Point3D(5, 0, 1), new Point3D(1, 3, -2)];
            const face = new Face3D(points, true, true);
            const scaleFactor = 2;
            const faceScaled = face.map((point) => {
                return new Point3D(point.x*scaleFactor, point.y*scaleFactor, point.z*scaleFactor);
            })
            let pointMappedCorrectly: boolean;
            for (let i = 0; i < face.numVertices; i++) {
                pointMappedCorrectly = faceScaled.vertices[i].equals(new Point3D(face.vertices[i].x*scaleFactor, face.vertices[i].y*scaleFactor, face.vertices[i].z*scaleFactor));
                pointMappedCorrectly.should.equal(true);
            }
        });
    });

    describe("Face3D.planeCoefficients()", () => {
        it("Basic #1", () => {
            // Setup face
            const points = [new Point3D(1, 1, 9), new Point3D(2, -2, 0), new Point3D(6, 4, 0)];
            const face = new Face3D(points, true, true);
            const coeffs = face.planeCoefficients();
            coeffs.length.should.equal(4);

            const actualCoeffs = [3, -2, 1, -10];
            const t = coeffs[0]/actualCoeffs[0];
            for (let i = 1; i < coeffs.length; i++) {
                t.should.equal(coeffs[i]/actualCoeffs[i]);
            }
        });
    });

    describe("Face3D.area()", () => {
        it("Basic #1 - Triangle", () => {
            // Setup face
            const points = [new Point3D(1, 1, 9), new Point3D(2, -2, 0), new Point3D(6, 4, 0)];
            const face = new Face3D(points, true, true);
            const calculatedArea = face.area();
            const expectedArea = 9*Math.sqrt(14);
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Basic #2 - Rectangle", () => {
            // Setup face
            const points = [new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(4, 0, 2), new Point3D(4, 1, 2)];
            const face = new Face3D(points, true, true);
            const calculatedArea = face.area();
            const expectedArea = 2*Math.sqrt(5);
            calculatedArea.should.be.a('number');
            calculatedArea.should.equal(expectedArea);
        });

        it("Complex #1", () => {
            // Setup points
            const A = new Point3D(-0.17888, 2.77628, 5.01593);
            const B = new Point3D(-2.32012, 4.80474, 2.64912);
            const C = new Point3D(-1.27458, 1.58113, -0.66147);
            const D = new Point3D(1.11336, -1.42007, 0.49995);
            const E = new Point3D(1.97915, -1.23546, 3.46653);
            const F = new Point3D(1.80453, -0.70797, 3.99763);

            // Setup Face
            const face = new Face3D([A, B, C, D, E, F], false, true)
            const calculatedArea = face.area();
            const expectedArea = 28.49932;
            calculatedArea.should.be.a('number');
            calculatedArea.should.closeTo(expectedArea, 1e-4);
        });

        it("Null Behaviour - Empty #1", () => {
            const emptyPolygon = new Face3D([]);
            emptyPolygon.area().should.equal(0);
        });

        it("Null Behaviour - Empty #2", () => {
            const emptyPolygon = new Face3D([], false, true);
            emptyPolygon.area().should.equal(0);
        })

        it("Null Behaviour - Empty #3", () => {
            const emptyPolygon = new Face3D([new Point3D(0, 1, 1), new Point3D(0, 0, 0), new Point3D(0, 1, 0), new Point3D(1, 0, 1)], true, true);
            emptyPolygon.area().should.equal(0);
        })

        it("Null Behaviour - Singular #1", () => {
            const point = new Face3D([new Point3D(1, 2, 1)]);
            point.area().should.equal(0);
        });

        it("Null Behaviour - Singular #2", () => {
            const point = new Face3D([new Point3D(1, 2, 1)], false, true);
            point.area().should.equal(0);
        });

        it("Null Behaviour - Line #1", () => {
            const line = new Face3D([new Point3D(-1, 0, 1), new Point3D(4, 0, 4)]);
            line.area().should.equal(0);
        })

        it("Null Behaviour - Line #2", () => {
            const line = new Face3D([new Point3D(-1, 0, 1), new Point3D(4, 0, 4)], false, true);
            line.area().should.equal(0);
        })
    });
});