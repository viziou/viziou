import { getIntersectionPolyhedra, IoU } from "./iou.ts";
import { Point3D, Face3D, Polyhedra3D } from "./classes.ts";

// Setup polyhedra
const A = new Point3D(0, 0, 0);
const B = new Point3D(2, 0, 0);
const C = new Point3D(2, 2, 0);
const D = new Point3D(0, 2, 0);
const E = new Point3D(0, 0, 2);
const F = new Point3D(2, 0, 2);
const G = new Point3D(2, 2, 2);
const H = new Point3D(0, 2, 2);
const face1 = new Face3D([A, B, C, D], true, true);
const face2 = new Face3D([A, B, F, E], true, true);
const face3 = new Face3D([B, C, G, F], true, true);
const face4 = new Face3D([C, D, H, G], true, true);
const face5 = new Face3D([D, A, E, H], true, true);
const face6 = new Face3D([E, F, G, H], true, true);
const cube = new Polyhedra3D([face1, face2, face3, face4, face5, face6]);

const offsetCube = cube.map((point) => {
    return point.add(new Point3D(1, 1, 1));
})

let f = cube.faces[0];
console.log(f.toString());
console.log(f.normal);

// Face2,3,4,5,6 has inwards normal

console.log(cube.toString());
console.log(offsetCube.toString());


console.log(cube.volume());
console.log(offsetCube.volume());

const intersection = getIntersectionPolyhedra(cube, offsetCube);
console.log(intersection.toString());

const iou = IoU(cube, offsetCube);
console.log(iou);