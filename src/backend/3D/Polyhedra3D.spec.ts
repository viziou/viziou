import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Point3D, Face3D, Polyhedra3D } from "./classes.ts";
const should = setupShould();


describe("Testing Class: Polyhedra3D", () => {
    describe("Constructor", () => {
        it("Basic", () => {
            // Setup points
            const A = new Point3D(-7.89284, 4.59079, 0);
            const B = new Point3D(2.88411, -6.67543, 0);
            const C = new Point3D(7.25247, 8.29079, 0);
            const D = new Point3D(0.74792, 2.06872, 12.72976);

            // Setup Faces
            const face1 = new Face3D([A, B, C], true, true)
            const face2 = new Face3D([A, C, D], true, true)
            const face3 = new Face3D([A, B, D], true, true)
            const face4 = new Face3D([B, C, D], true, true)

            // Setup polyhedra
            const polyhedra = new Polyhedra3D([face1, face2, face3, face4]);
            should.exist(polyhedra);
            polyhedra.faces.length.should.equal(4);
            polyhedra.faces.forEach((face) => {
                face.vertices.length.should.equal(3);
            })
        });

        it("Check for Side-Effect", () => {
            // Setup points
            const A = new Point3D(-7.89284, 4.59079, 0);
            const B = new Point3D(2.88411, -6.67543, 0);
            const C = new Point3D(7.25247, 8.29079, 0);
            const D = new Point3D(0.74792, 2.06872, 12.72976);

            // Setup Faces
            const face1 = new Face3D([A, B, C], true, true)
            const face2 = new Face3D([A, C, D], true, true)
            const face3 = new Face3D([A, B, D], true, true)
            const face4 = new Face3D([B, C, D], true, true)

            // Setup polyhedra
            const faces = [face1, face2, face3, face4];
            const polyhedra = new Polyhedra3D(faces);

            let result: boolean;
            const E = new Point3D(0, 0, 1);
            const F = new Point3D(0, 1, 0);
            const G = new Point3D(1, 0, 0);
            const newFace = new Face3D([E, F, G], true, true);

            // Check if a copy was appropriately made and no side effect can happen
            faces[0] = newFace;
            for (let i = 0; i < face1.numVertices; i++) {
                result = polyhedra.faces[0].vertices[i].equals(newFace.vertices[i]);
                result.should.not.equal(true);
            }      

            // Directly changing the return of polyhedra faces should also not change the internal
            polyhedra.faces[0] = newFace;
            for (let i = 0; i < face1.numVertices; i++) {
                result = polyhedra.faces[0].vertices[i].equals(newFace.vertices[i]);
                result.should.not.equal(true);
            }    
        });
    });

    describe("Polyhedra3D.getCentroid()", () => {
        it("Cube", () => {
            // Setup polyhedra
            const A = new Point3D(0, 0, 0);
            const B = new Point3D(1, 0, 0);
            const C = new Point3D(1, 1, 0);
            const D = new Point3D(0, 1, 0);
            const E = new Point3D(0, 0, 1);
            const F = new Point3D(1, 0, 1);
            const G = new Point3D(1, 1, 1);
            const H = new Point3D(0, 1, 1);
            const face1 = new Face3D([A, B, C, D], false, true);
            const face2 = new Face3D([A, B, F, E], false, true);
            const face3 = new Face3D([B, C, G, F], false, true);
            const face4 = new Face3D([C, D, H, G], false, true);
            const face5 = new Face3D([D, A, E, H], false, true);
            const face6 = new Face3D([E, F, G, H], false, true);
            const cube = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

            const actualCentre = new Point3D(1/2, 1/2, 1/2);
            const result = actualCentre.equals(cube.centroid());
            result.should.equal(true);
        });

        it("Pyramid", () => {
            // Setup polyhedra
            const A = new Point3D(0, 0, 0);
            const B = new Point3D(2, 0, 0);
            const C = new Point3D(0, 3, 0);
            const D = new Point3D(2, 3, 0);
            const E = new Point3D(1, 3/2, 4);
            const face1 = new Face3D([A, B, C, D], true, true);
            const face2 = new Face3D([A, B, E], true, true);
            const face3 = new Face3D([B, D, E], true, true);
            const face4 = new Face3D([D, C, E], true, true);
            const face5 = new Face3D([C, A, E], true, true);
            const pyramid = new Polyhedra3D([face1, face2, face3, face4, face5]);

            const actualCentre = new Point3D(1, 3/2, 16/15);
            const result = actualCentre.equals(pyramid.centroid());
            result.should.equal(true, pyramid.centroid().toString());
        });
    });

    describe("Polyhedra3D.map()", () => {
        it("Translation", () => {
            // Setup polyhedra
            const A = new Point3D(0, 0, 0);
            const B = new Point3D(1, 0, 0);
            const C = new Point3D(1, 1, 0);
            const D = new Point3D(0, 1, 0);
            const E = new Point3D(0, 0, 1);
            const F = new Point3D(1, 0, 1);
            const G = new Point3D(1, 1, 1);
            const H = new Point3D(0, 1, 1);
            const face1 = new Face3D([A, B, C, D], false, true);
            const face2 = new Face3D([A, B, F, E], false, true);
            const face3 = new Face3D([B, C, G, F], false, true);
            const face4 = new Face3D([C, D, H, G], false, true);
            const face5 = new Face3D([D, A, E, H], false, true);
            const face6 = new Face3D([E, F, G, H], false, true);
            const cube = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);
            
            const translationX = 7;
            const translationY = -8;
            const translationZ = 1;
            const cubeTranslated = cube.map((point) => {
                return new Point3D(point.x + translationX, point.y + translationY, point.z + translationZ);
            })

            let pointMappedCorrectly: boolean;
            for (let i = 0; i < cube.numFaces; i++) {
                for (let j = 0; j < cube.faces[i].numVertices; j++) {
                    let face = cube.faces[i]
                    pointMappedCorrectly = cubeTranslated.faces[i].vertices[j].equals(new Point3D(face.vertices[j].x + translationX, face.vertices[j].y + translationY, face.vertices[j].z + translationZ));
                    pointMappedCorrectly.should.equal(true);
                }
            }
        });

        it("Scaling", () => {
            // Setup polyhedra
            const A = new Point3D(0, 0, 0);
            const B = new Point3D(1, 0, 0);
            const C = new Point3D(1, 1, 0);
            const D = new Point3D(0, 1, 0);
            const E = new Point3D(0, 0, 1);
            const F = new Point3D(1, 0, 1);
            const G = new Point3D(1, 1, 1);
            const H = new Point3D(0, 1, 1);
            const face1 = new Face3D([A, B, C, D], false, true);
            const face2 = new Face3D([A, B, F, E], false, true);
            const face3 = new Face3D([B, C, G, F], false, true);
            const face4 = new Face3D([C, D, H, G], false, true);
            const face5 = new Face3D([D, A, E, H], false, true);
            const face6 = new Face3D([E, F, G, H], false, true);
            const cube = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

            const scaleFactor = 2;
            const cubeScaled = cube.map((point) => {
                return new Point3D(point.x*scaleFactor, point.y*scaleFactor, point.z*scaleFactor);
            })

            let pointMappedCorrectly: boolean;
            for (let i = 0; i < cube.numFaces; i++) {
                for (let j = 0; j < cube.faces[i].numVertices; j++) {
                    let face = cube.faces[i]
                    pointMappedCorrectly = cubeScaled.faces[i].vertices[j].equals(new Point3D(face.vertices[j].x*scaleFactor, face.vertices[j].y*scaleFactor, face.vertices[j].z*scaleFactor));
                    pointMappedCorrectly.should.equal(true);
                }
            }
        });
    });

    describe("Polyhedra3D.volume()", () => {
        it("Basic #1 - Cube", () => {
            // Setup polyhedra
            const A = new Point3D(0, 0, 0);
            const B = new Point3D(1, 0, 0);
            const C = new Point3D(1, 1, 0);
            const D = new Point3D(0, 1, 0);
            const E = new Point3D(0, 0, 1);
            const F = new Point3D(1, 0, 1);
            const G = new Point3D(1, 1, 1);
            const H = new Point3D(0, 1, 1);
            const face1 = new Face3D([A, B, C, D], true, true);
            const face2 = new Face3D([A, B, F, E], true, true);
            const face3 = new Face3D([B, C, G, F], true, true);
            const face4 = new Face3D([C, D, H, G], true, true);
            const face5 = new Face3D([D, A, E, H], true, true);
            const face6 = new Face3D([E, F, G, H], true, true);
            const cube = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

            // Check if volumes match
            const calculatedVolume = cube.volume();
            const expectedVolume = 1;
            calculatedVolume.should.be.a('number');
            calculatedVolume.should.closeTo(expectedVolume, 1e-10);
        });

        it("Basic #2 - Prism", () => {
            // Setup polyhedra
            const A = new Point3D(0, 2, 0);
            const B = new Point3D(-3, -3, 0);
            const C = new Point3D(3, -2, 0);
            const D = new Point3D(0, 2, 6);
            const E = new Point3D(-3, -3, 6);
            const F = new Point3D(3, -2, 6);
            const face1 = new Face3D([A, B, C], true, true);
            const face2 = new Face3D([A, B, E, D], true, true);
            const face3 = new Face3D([B, C, F, E], true, true);
            const face4 = new Face3D([C, A, D, F], true, true);
            const face5 = new Face3D([D, E, F], true, true);
            const prism = new Polyhedra3D([face1, face2, face3, face4, face5]);

            // Check if volumes match
            const calculatedVolume = prism.volume();
            const expectedVolume = 81;
            calculatedVolume.should.be.a('number');
            calculatedVolume.should.equal(expectedVolume);
        });

        it("Basic #3 - Pyramid", () => {
            // Setup polyhedra
            const A = new Point3D(0, 0, 0);
            const B = new Point3D(2, 0, 0);
            const C = new Point3D(0, 3, 0);
            const D = new Point3D(2, 3, 0);
            const E = new Point3D(1, 3/2, 4);
            const face1 = new Face3D([A, B, C, D], true, true);
            const face2 = new Face3D([A, B, E], true, true);
            const face3 = new Face3D([B, D, E], true, true);
            const face4 = new Face3D([D, C, E], true, true);
            const face5 = new Face3D([C, A, E], true, true);
            const pyramid = new Polyhedra3D([face1, face2, face3, face4, face5]);

            // Check if volumes match
            const calculatedVolume = pyramid.volume();
            const expectedVolume = 8;
            calculatedVolume.should.be.a('number');
            calculatedVolume.should.equal(expectedVolume);
        });

        it("Complex #1 - Crystal", () => {
            // Setup points
            let A = new Point3D(-5.53586, 4.80976, 0);
            let B = new Point3D(-1.99048, 6.34833, 0);
            let C = new Point3D(4, 4, 0);
            let D = new Point3D(-6.56154, -1.45753, 0);
            let E = new Point3D(3.36309, -6.90257, 0);
            let F = new Point3D(-5.54, 4.81, 5);
            let G = new Point3D(-1.99462, 6.34857, 5);
            let H = new Point3D(3.99586, 4.00024, 5);
            let I = new Point3D(3.35895, -6.90233, 5);
            let J = new Point3D(-6.56568, -1.45729, 5);
            let K = new Point3D(-1.3491, 1.35984, 13.65476);
            let N = new Point3D(-1.34496, 1.3596, -4);

            // Setup Faces
            let face1 = new Face3D([K, I, H], true, true)
            let face2 = new Face3D([J, I, D, E], true, true)
            let face3 = new Face3D([I, H, C, E], true, true)
            let face4 = new Face3D([H, G, C, B], true, true)
            let face5 = new Face3D([G, B, F, A], true, true)
            let face6 = new Face3D([F, J, A, D], true, true)
            let face7 = new Face3D([K, H, G], true, true)
            let face8 = new Face3D([K, F, G], true, true)
            let face9 = new Face3D([K, F, J], true, true)
            let face10 = new Face3D([K, I, J], true, true)
            let face11 = new Face3D([A, D, N], true, true)
            let face12 = new Face3D([D, E, N], true, true)
            let face13 = new Face3D([E, C, N], true, true)
            let face14 = new Face3D([C, B, N], true, true)
            let face15 = new Face3D([B, A, N], true, true)

            // Setup polyhedra
            let crystal = new Polyhedra3D([
                face1, face2, face3, face4, face5, face6, face7,
                face8, face9, face10, face11, face12, face13, face14, face15
            ]);

            // Check if volumes match
            const calculatedVolume = crystal.volume();
            const expectedVolume = 874.85379;
            calculatedVolume.should.be.a('number');
            calculatedVolume.should.closeTo(expectedVolume, 1e-4);
        });

        it("Null Behaviour - Empty", () => {
            const emptyPolyhedra = new Polyhedra3D([]);
            emptyPolyhedra.volume().should.equal(0);
        });

        it("Null Behaviour - Singular Face", () => {
            const face = new Polyhedra3D([new Face3D([new Point3D(0, 0, 0), new Point3D(0, 0, 1), new Point3D(0, 1, 1)], true, true)]);
            face.volume().should.equal(0);
        });

        it("Null Behaviour - Two Face", () => {
            const faces = new Polyhedra3D([
                new Face3D([
                    new Point3D(0, 0, 0), 
                    new Point3D(0, 0, 1), 
                    new Point3D(0, 1, 1)
                ], true, true),
                new Face3D([
                    new Point3D(-1, -1, -1), 
                    new Point3D(0, 0, 0), 
                    new Point3D(0, 0, 1)
                ], true, true)
            ]);
            faces.volume().should.equal(0);
        })

        // TODO: Implement this check
        // it("Null Behaviour - Non Enclosed Faces", () => {
        //     const line = new Face3D([new Point3D(-1, 0, 1), new Point3D(4, 0, 4)]);
        //     line.calculateArea().should.equal(0);
        // })
    });
});