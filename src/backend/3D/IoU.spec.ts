import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Point3D, Face3D, Polyhedra3D } from "./classes.ts";
import { getIntersectionPolyhedra, IoU } from "./iou.ts";
import { nearlyEqual } from "../utils.ts";
const should = setupShould();

describe("Testing getIntersectingPolyhedra()", () => {
    it("No Intersection", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube very far away
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(10, 10, 10));
        })

        // Calculate intersection
        const resultIntersectCube = getIntersectionPolyhedra(cube1, cube2);

        // Intersecting polyhedra does not exist
        resultIntersectCube.numFaces.should.equal(0);
        resultIntersectCube.equals(new Polyhedra3D([])).should.equal(true);
    });

    it("Polyhedra Encompasses Polyhedra", () => {
        // Setup cube
        let A = new Point3D(0, 0, 0);
        let B = new Point3D(2, 0, 0);
        let C = new Point3D(2, 2, 0);
        let D = new Point3D(0, 2, 0);
        let E = new Point3D(0, 0, 2);
        let F = new Point3D(2, 0, 2);
        let G = new Point3D(2, 2, 2);
        let H = new Point3D(0, 2, 2);
        let face1 = new Face3D([A, B, C, D], true, true);
        let face2 = new Face3D([A, B, F, E], true, true);
        let face3 = new Face3D([B, C, G, F], true, true);
        let face4 = new Face3D([C, D, H, G], true, true);
        let face5 = new Face3D([D, A, E, H], true, true);
        let face6 = new Face3D([E, F, G, H], true, true);
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Setup smaller cube inside cube1
        A = new Point3D(0.5, 0.5, 0.5);
        B = new Point3D(1.5, 0.5, 0.5);
        C = new Point3D(1.5, 1.5, 0.5);
        D = new Point3D(0.5, 1.5, 0.5);
        E = new Point3D(0.5, 0.5, 1.5);
        F = new Point3D(1.5, 0.5, 1.5);
        G = new Point3D(1.5, 1.5, 1.5);
        H = new Point3D(0.5, 1.5, 1.5);
        face1 = new Face3D([A, B, C, D], true, true);
        face2 = new Face3D([A, B, F, E], true, true);
        face3 = new Face3D([B, C, G, F], true, true);
        face4 = new Face3D([C, D, H, G], true, true);
        face5 = new Face3D([D, A, E, H], true, true);
        face6 = new Face3D([E, F, G, H], true, true);
        const cube2 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Calculate intersection
        const resultIntersectCube = getIntersectionPolyhedra(cube1, cube2);

        // Intersection should just be the smaller cube
        resultIntersectCube.equals(cube2).should.equal(true);
    });

    it("Identical Polyhedra", () => {
        // Setup cube
        let A = new Point3D(0, 0, 0);
        let B = new Point3D(2, 0, 0);
        let C = new Point3D(2, 2, 0);
        let D = new Point3D(0, 2, 0);
        let E = new Point3D(0, 0, 2);
        let F = new Point3D(2, 0, 2);
        let G = new Point3D(2, 2, 2);
        let H = new Point3D(0, 2, 2);
        let face1 = new Face3D([A, B, C, D], true, true);
        let face2 = new Face3D([A, B, F, E], true, true);
        let face3 = new Face3D([B, C, G, F], true, true);
        let face4 = new Face3D([C, D, H, G], true, true);
        let face5 = new Face3D([D, A, E, H], true, true);
        let face6 = new Face3D([E, F, G, H], true, true);
        const cube = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Calculate intersection
        const resultIntersectCube = getIntersectionPolyhedra(cube, cube);

        // Intersection should be itself
        resultIntersectCube.equals(cube).should.equal(true);
    });

    it("Single Full Face", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single face is fully intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0, 0, 1));
        })

        // Calculate intersection
        const resultIntersectCube = getIntersectionPolyhedra(cube1, cube2);

        // Intersecting polyhedra does not exist
        resultIntersectCube.numFaces.should.equal(0);
        resultIntersectCube.equals(new Polyhedra3D([])).should.equal(true);
    });

    it("Single Partial Face", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single face is partially intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0.5, 0.5, 1));
        })

        // Calculate intersection
        const resultIntersectCube = getIntersectionPolyhedra(cube1, cube2);

        // Intersecting polyhedra does not exist
        resultIntersectCube.numFaces.should.equal(0);
        resultIntersectCube.equals(new Polyhedra3D([])).should.equal(true);
    });

    it("Single Full Edge", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single edge is fully intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0, 1, 1));
        })

        // Calculate intersection
        const resultIntersectCube = getIntersectionPolyhedra(cube1, cube2);

        // Intersecting polyhedra does not exist
        resultIntersectCube.numFaces.should.equal(0);
        resultIntersectCube.equals(new Polyhedra3D([])).should.equal(true);
    });

    it("Single Partial Edge", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single edge is partially intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0.5, 1, 1));
        })

        // Calculate intersection
        const resultIntersectCube = getIntersectionPolyhedra(cube1, cube2);

        // Intersecting polyhedra does not exist
        resultIntersectCube.numFaces.should.equal(0);
        resultIntersectCube.equals(new Polyhedra3D([])).should.equal(true);
    });

    it("Single Vertex on Vertex", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single vertex is intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(1, 1, 1));
        })

        // Calculate intersection
        const resultIntersectCube = getIntersectionPolyhedra(cube1, cube2);

        // Intersecting polyhedra does not exist
        resultIntersectCube.numFaces.should.equal(0);
        resultIntersectCube.equals(new Polyhedra3D([])).should.equal(true);
    });

    it("Intersecting Cubes", () => {
        // Setup unit cube
        let A = new Point3D(0, 0, 0);
        let B = new Point3D(1, 0, 0);
        let C = new Point3D(1, 1, 0);
        let D = new Point3D(0, 1, 0);
        let E = new Point3D(0, 0, 1);
        let F = new Point3D(1, 0, 1);
        let G = new Point3D(1, 1, 1);
        let H = new Point3D(0, 1, 1);
        let face1 = new Face3D([A, B, C, D], true, true);
        let face2 = new Face3D([A, B, F, E], true, true);
        let face3 = new Face3D([B, C, G, F], true, true);
        let face4 = new Face3D([C, D, H, G], true, true);
        let face5 = new Face3D([D, A, E, H], true, true);
        let face6 = new Face3D([E, F, G, H], true, true);
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0.5, 0.5, 0.5));
        })

        // Calculate intersection
        const resultIntersectCube = getIntersectionPolyhedra(cube1, cube2);

        // Setup actual answer
        A = new Point3D(0.5, 0.5, 0.5);
        B = new Point3D(1, 0.5, 0.5);
        C = new Point3D(1, 1, 0.5);
        D = new Point3D(0.5, 1, 0.5);
        E = new Point3D(0.5, 0.5, 1);
        F = new Point3D(1, 0.5, 1);
        G = new Point3D(1, 1, 1);
        H = new Point3D(0.5, 1, 1);
        face1 = new Face3D([A, B, C, D], true, true);
        face2 = new Face3D([A, B, F, E], true, true);
        face3 = new Face3D([B, C, G, F], true, true);
        face4 = new Face3D([C, D, H, G], true, true);
        face5 = new Face3D([D, A, E, H], true, true);
        face6 = new Face3D([E, F, G, H], true, true);
        const actualIntersectCube = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Verify if same
        resultIntersectCube.numFaces.should.equal(6);
        resultIntersectCube.equals(actualIntersectCube).should.equal(true);
    });

    it("Intersecting Pyramids", () => {
        // Setup pyramid 1
        const A = new Point3D(1, 1, 0);
        const B = new Point3D(1, -1, 0);
        const C = new Point3D(-1, -1, 0);
        const D = new Point3D(-1, 1, 0);
        const E = new Point3D(0, 0, 2);
        let face1 = new Face3D([A, B, C, D], true, true);
        let face2 = new Face3D([A, D, E], true, true);
        let face3 = new Face3D([D, E, C], true, true);
        let face4 = new Face3D([C, E, B], true, true);
        let face5 = new Face3D([B, E, A], true, true);
        const pyramid1 = new Polyhedra3D([face1, face2, face3, face4, face5]);

        // Setup pyramid 2
        const F = new Point3D(0, 0, 1);
        const G = new Point3D(1, 1, 5);
        const H = new Point3D(1, -1, 5);
        const I = new Point3D(-1, -1, 5);
        const J = new Point3D(-1, 1, 5);
        face1 = new Face3D([H, G, J, I], true, true);
        face2 = new Face3D([H, G, F], true, true);
        face3 = new Face3D([G, J, F], true, true);
        face4 = new Face3D([J, I, F], true, true);
        face5 = new Face3D([I, H, F], true, true);
        const pyramid2 = new Polyhedra3D([face1, face2, face3, face4, face5]);

        // Calculate intersection
        const resultIntersectPolyhedra = getIntersectionPolyhedra(pyramid1, pyramid2);

        // Setup polyhedra object of intersection
        const K = new Point3D(-1/6, -1/6, 5/3);
        const L = new Point3D(1/6, -1/6, 5/3);
        const M = new Point3D(1/6, 1/6, 5/3);
        const N = new Point3D(-1/6, 1/6, 5/3);
        face1 = new Face3D([K, L, E], true, true);
        face2 = new Face3D([L, M, E], true, true);
        face3 = new Face3D([M, N, E], true, true);
        face4 = new Face3D([N, K, E], true, true);
        face5 = new Face3D([K, L, F], true, true);
        let face6 = new Face3D([L, M, F], true, true);
        let face7 = new Face3D([M, N, F], true, true);
        let face8 = new Face3D([N, K, F], true, true);
        const actualIntersectionPolyhedra = new Polyhedra3D([face1, face2, face3, face4, face5, face6, face7, face8]);

        // Verify if same
        resultIntersectPolyhedra.numFaces.should.equal(8);
        resultIntersectPolyhedra.equals(actualIntersectionPolyhedra).should.equal(true);
    });
});

describe("Testing 3D IoU Functionality", () => {
    it("Commutativity Test", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single face is fully intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0, 1, 1));
        })

        // Calaculate IoU
        const iou12 = IoU(cube1, cube2);
        const iou21 = IoU(cube2, cube1);

        should.exist(iou12);
        iou12.should.be.a('number');

        should.exist(iou21);
        iou21.should.be.a('number');

        iou12.should.equal(iou21);
    });

    it("Identity Test", () => {
        // Setup unit cube
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

        // Calculate IoU
        const iou = IoU(cube, cube);

        should.exist(iou);
        iou.should.be.a('number');
        iou.should.equal(1);
    });

    it("Polyhedra Encompasses Polyhedra Test", () => {
        // Setup cube
        let A = new Point3D(0, 0, 0);
        let B = new Point3D(2, 0, 0);
        let C = new Point3D(2, 2, 0);
        let D = new Point3D(0, 2, 0);
        let E = new Point3D(0, 0, 2);
        let F = new Point3D(2, 0, 2);
        let G = new Point3D(2, 2, 2);
        let H = new Point3D(0, 2, 2);
        let face1 = new Face3D([A, B, C, D], true, true);
        let face2 = new Face3D([A, B, F, E], true, true);
        let face3 = new Face3D([B, C, G, F], true, true);
        let face4 = new Face3D([C, D, H, G], true, true);
        let face5 = new Face3D([D, A, E, H], true, true);
        let face6 = new Face3D([E, F, G, H], true, true);
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Setup smaller cube inside cube1
        A = new Point3D(0.5, 0.5, 0.5);
        B = new Point3D(1.5, 0.5, 0.5);
        C = new Point3D(1.5, 1.5, 0.5);
        D = new Point3D(0.5, 1.5, 0.5);
        E = new Point3D(0.5, 0.5, 1.5);
        F = new Point3D(1.5, 0.5, 1.5);
        G = new Point3D(1.5, 1.5, 1.5);
        H = new Point3D(0.5, 1.5, 1.5);
        face1 = new Face3D([A, B, C, D], true, true);
        face2 = new Face3D([A, B, F, E], true, true);
        face3 = new Face3D([B, C, G, F], true, true);
        face4 = new Face3D([C, D, H, G], true, true);
        face5 = new Face3D([D, A, E, H], true, true);
        face6 = new Face3D([E, F, G, H], true, true);
        const cube2 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Calculate IoU
        const iou = IoU(cube1, cube2);
        iou.should.be.closeTo(cube2.volume()/cube1.volume(), 1e-10);
    });

    it("No Intersection Test", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube very far away
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(10, 10, 10));
        })

        // Calculate IoU
        const iou = IoU(cube1, cube2);
        iou.should.equal(0);
    });

    it("No Union Test", () => {
        const poly1 = new Polyhedra3D([new Face3D([new Point3D(0, 0, 0)])]);
        const poly2 = new Polyhedra3D([new Face3D([new Point3D(1, 1, 1)])]);

        // Calculate IoU
        const iou = IoU(poly1, poly2);
        iou.should.equal(0);
    });

    it("Single Vertex-Vertex Intersection Test", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single vertex is intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(1, 1, 1));
        })

        // Calculate IoU
        const iou = IoU(cube1, cube2);
        iou.should.equal(0);
    });

    it("Full Edge Intersection Test", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single edge is fully intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0, 1, 1));
        })

        // Calculate IoU
        const iou = IoU(cube1, cube2);
        iou.should.equal(0);
    });

    it("Partial Edge Intersection Test", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single edge is partially intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0.5, 1, 1));
        })

        // Calculate IoU
        const iou = IoU(cube1, cube2);
        iou.should.equal(0);
    });

    it("Full Face Intersection Test", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single face is fully intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0, 0, 1));
        })

        // Calculate IoU
        const iou = IoU(cube1, cube2);
        iou.should.equal(0);
    });

    it("Partial Face Intersection Test", () => {
        // Setup unit cube
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
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube 1 unit across so only a single face is partially intersecting
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0.5, 0.5, 1));
        })

        // Calculate IoU
        const iou = IoU(cube1, cube2);
        iou.should.equal(0);
    });

    it("Polyhedra w/ < 4 Faces Test", () => {
        // Setup infeasible polyhedra
        const A = new Point3D(0, 0, 0);
        const B = new Point3D(1, 0, 0);
        const C = new Point3D(1, 1, 0);
        const D = new Point3D(0, 1, 0);
        const E = new Point3D(0, 0, 1);
        const F = new Point3D(1, 0, 1);
        const G = new Point3D(1, 1, 1);
        const face1 = new Face3D([A, B, C, D], true, true);
        const face2 = new Face3D([A, B, F, E], true, true);
        const face3 = new Face3D([B, C, G, F], true, true);
        const poly1 = new Polyhedra3D([face1, face2, face3]);

        // Setup another infeasible polyhedra
        const poly2 = poly1.map((point) => {
            return point.add(new Point3D(0.5, 0.5, 1));
        })

        // Calculate IoU
        const iou = IoU(poly1, poly2);
        iou.should.equal(0);
    });

    it("Cubes IoU Test #1", () => {
        // Setup unit cube
        let A = new Point3D(0, 0, 0);
        let B = new Point3D(1, 0, 0);
        let C = new Point3D(1, 1, 0);
        let D = new Point3D(0, 1, 0);
        let E = new Point3D(0, 0, 1);
        let F = new Point3D(1, 0, 1);
        let G = new Point3D(1, 1, 1);
        let H = new Point3D(0, 1, 1);
        let face1 = new Face3D([A, B, C, D], true, true);
        let face2 = new Face3D([A, B, F, E], true, true);
        let face3 = new Face3D([B, C, G, F], true, true);
        let face4 = new Face3D([C, D, H, G], true, true);
        let face5 = new Face3D([D, A, E, H], true, true);
        let face6 = new Face3D([E, F, G, H], true, true);
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0.5, 0.5, 0.5));
        })

        // Calculate IoU
        const iou = IoU(cube1, cube2)

        const expectedCube1Volume = 1;
        const expectedCube2Volume = 1;
        const expectedIntersectionVolume = 1/8;

        let result: boolean;
        result = nearlyEqual(cube1.volume(), expectedCube1Volume);
        result.should.equal(true);
        result = nearlyEqual(cube2.volume(), expectedCube2Volume);
        result.should.equal(true);
        result = nearlyEqual(getIntersectionPolyhedra(cube1, cube2).volume(), expectedIntersectionVolume);
        result.should.equal(true);

        const expectedIoU = 1/15;
        result = nearlyEqual(iou, expectedIoU);
        result.should.equal(true);
    });

    it("Cubes IoU Test #2", () => {
        // Setup unit cube
        let A = new Point3D(0, 0, 0);
        let B = new Point3D(1, 0, 0);
        let C = new Point3D(1, 1, 0);
        let D = new Point3D(0, 1, 0);
        let E = new Point3D(0, 0, 1);
        let F = new Point3D(1, 0, 1);
        let G = new Point3D(1, 1, 1);
        let H = new Point3D(0, 1, 1);
        let face1 = new Face3D([A, B, C, D], true, true);
        let face2 = new Face3D([A, B, F, E], true, true);
        let face3 = new Face3D([B, C, G, F], true, true);
        let face4 = new Face3D([C, D, H, G], true, true);
        let face5 = new Face3D([D, A, E, H], true, true);
        let face6 = new Face3D([E, F, G, H], true, true);
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0.5, 0.5, 0));
        })

        // Calculate IoU
        const iou = IoU(cube1, cube2)

        const expectedCube1Volume = 1;
        const expectedCube2Volume = 1;
        const expectedIntersectionVolume = 1/4;

        let result: boolean;
        result = nearlyEqual(cube1.volume(), expectedCube1Volume);
        result.should.equal(true);
        result = nearlyEqual(cube2.volume(), expectedCube2Volume);
        result.should.equal(true);
        result = nearlyEqual(getIntersectionPolyhedra(cube1, cube2).volume(), expectedIntersectionVolume);
        result.should.equal(true);

        const expectedIoU = 1/7;
        result = nearlyEqual(iou, expectedIoU);
        result.should.equal(true);
    });

    it("Cubes IoU Test #3", () => {
        // Setup unit cube
        let A = new Point3D(0, 0, 0);
        let B = new Point3D(1, 0, 0);
        let C = new Point3D(1, 1, 0);
        let D = new Point3D(0, 1, 0);
        let E = new Point3D(0, 0, 1);
        let F = new Point3D(1, 0, 1);
        let G = new Point3D(1, 1, 1);
        let H = new Point3D(0, 1, 1);
        let face1 = new Face3D([A, B, C, D], true, true);
        let face2 = new Face3D([A, B, F, E], true, true);
        let face3 = new Face3D([B, C, G, F], true, true);
        let face4 = new Face3D([C, D, H, G], true, true);
        let face5 = new Face3D([D, A, E, H], true, true);
        let face6 = new Face3D([E, F, G, H], true, true);
        const cube1 = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

        // Set second unit cube
        const cube2 = cube1.map((point) => {
            return point.add(new Point3D(0.9, 0, 0));
        })

        // Calculate IoU
        const iou = IoU(cube1, cube2)

        const expectedCube1Volume = 1;
        const expectedCube2Volume = 1;
        const expectedIntersectionVolume = 0.1;

        let result: boolean;
        result = nearlyEqual(cube1.volume(), expectedCube1Volume);
        result.should.equal(true);
        result = nearlyEqual(cube2.volume(), expectedCube2Volume);
        result.should.equal(true);
        result = nearlyEqual(getIntersectionPolyhedra(cube1, cube2).volume(), expectedIntersectionVolume);
        result.should.equal(true);

        const expectedIoU = 1/19;
        result = nearlyEqual(iou, expectedIoU);
        result.should.equal(true);
    });

    it("Pyramids IoU Test", () => {
         // Setup pyramid 1
         const A = new Point3D(1, 1, 0);
         const B = new Point3D(1, -1, 0);
         const C = new Point3D(-1, -1, 0);
         const D = new Point3D(-1, 1, 0);
         const E = new Point3D(0, 0, 2);
         let face1 = new Face3D([A, B, C, D], true, true);
         let face2 = new Face3D([A, D, E], true, true);
         let face3 = new Face3D([D, E, C], true, true);
         let face4 = new Face3D([C, E, B], true, true);
         let face5 = new Face3D([B, E, A], true, true);
         const pyramid1 = new Polyhedra3D([face1, face2, face3, face4, face5]);
 
         // Setup pyramid 2
         const F = new Point3D(0, 0, 1);
         const G = new Point3D(1, 1, 5);
         const H = new Point3D(1, -1, 5);
         const I = new Point3D(-1, -1, 5);
         const J = new Point3D(-1, 1, 5);
         face1 = new Face3D([H, G, J, I], true, true);
         face2 = new Face3D([H, G, F], true, true);
         face3 = new Face3D([G, J, F], true, true);
         face4 = new Face3D([J, I, F], true, true);
         face5 = new Face3D([I, H, F], true, true);
         const pyramid2 = new Polyhedra3D([face1, face2, face3, face4, face5]);

        // Calculate IoU
        const iou = IoU(pyramid1, pyramid2)

        const expectedPyramid1Volume = 8/3;
        const expectedPyramid2Volume = 16/3;
        const expectedIntersectionVolume = 1/27;

        let result: boolean;
        result = nearlyEqual(pyramid1.volume(), expectedPyramid1Volume);
        result.should.equal(true);
        result = nearlyEqual(pyramid2.volume(), expectedPyramid2Volume);
        result.should.equal(true);
        result = nearlyEqual(getIntersectionPolyhedra(pyramid1, pyramid2).volume(), expectedIntersectionVolume);
        result.should.equal(true);

        const expectedIoU = 1/215;
        result = nearlyEqual(iou, expectedIoU);
        result.should.equal(true);
    });
});