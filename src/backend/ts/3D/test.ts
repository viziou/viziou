import { Point3D, Edge3D, Face3D, Polyhedra3D } from "./classes.ts";
import { nearlyEqual } from "../utils.ts";

// // Setup points
// let A = new Point3D(-0.17888, 2.77628, 5.01593);
// let B = new Point3D(-2.32012, 4.80474, 2.64912);
// let C = new Point3D(-1.27458, 1.58113, -0.66147);
// let D = new Point3D(1.11336, -1.42007, 0.49995);
// let E = new Point3D(1.97915, -1.23546, 3.46653);
// let F = new Point3D(1.80453, -0.70797, 3.99763);

// // Setup Face
// let face = new Face3D([D, F, E, C, B, A], false, true)

// console.log(face.toString());
// console.log(face.calculateArea());

// // Setup points
// let A = new Point3D(-7.89284, 4.59079, 0);
// let B = new Point3D(2.88411, -6.67543, 0);
// let C = new Point3D(7.25247, 8.29079, 0);
// let D = new Point3D(0.74792, 2.06872, 12.72976);

// // Setup Faces
// let face1 = new Face3D([A, B, C], true, true)
// let face2 = new Face3D([A, C, D], true, true)
// let face3 = new Face3D([A, B, D], true, true)
// let face4 = new Face3D([B, C, D], true, true)

// // Setup polyhedra
// let bigboy = new Polyhedra3D([face1, face2, face3, face4]);

// console.log(face1.toString());
// console.log(face2.toString());
// console.log(face3.toString());
// console.log(face4.toString());
// console.log(face1.calculateArea());
// console.log(bigboy.volume());

// // Setup points
// let A = new Point3D(-5.53586,4.80976,0);
// let B = new Point3D(-1.99048,6.34833,0);
// let C = new Point3D(4,4,0);
// let D = new Point3D(-6.56154,-1.45753,0);
// let E = new Point3D(3.36309,-6.90257,0);
// let F = new Point3D(-5.54,4.81,5);
// let G = new Point3D(-1.99462,6.34857,5);
// let H = new Point3D(3.99586,4.00024,5);
// let I = new Point3D(3.35895,-6.90233,5);
// let J = new Point3D(-6.56568,-1.45729,5);

// // Setup Faces
// let face1 = new Face3D([A, B, C, D, E], true, true)
// let face2 = new Face3D([J, I, D, E], true, true)
// let face3 = new Face3D([I, H, C, E], true, true)
// let face4 = new Face3D([H, G, C, B], true, true)
// let face5 = new Face3D([G, B, F, A], true, true)
// let face6 = new Face3D([F, J, A, D], true, true)
// let face7 = new Face3D([G, F, J, I, H], true, true)

// // Setup polyhedra
// let bigboy = new Polyhedra3D([face1, face2, face3, face4, face5, face6, face7]);

// console.log(face1.toString());
// console.log(face2.toString());
// console.log(face3.toString());
// console.log(face4.toString());
// console.log(face5.toString());
// console.log(face6.toString());
// console.log(face7.toString());
// console.log(bigboy.volume());

// Setup points
let A = new Point3D(-5.53586,4.80976,0);
let B = new Point3D(-1.99048,6.34833,0);
let C = new Point3D(4,4,0);
let D = new Point3D(-6.56154,-1.45753,0);
let E = new Point3D(3.36309,-6.90257,0);
let F = new Point3D(-5.54,4.81,5);
let G = new Point3D(-1.99462,6.34857,5);
let H = new Point3D(3.99586,4.00024,5);
let I = new Point3D(3.35895,-6.90233,5);
let J = new Point3D(-6.56568,-1.45729,5);
let K = new Point3D(-1.3491,1.35984,13.65476);
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
let bigboy = new Polyhedra3D([
    face1, face2, face3, face4, face5, face6, face7,
    face8, face9, face10, face11, face12, face13, face14, face15
]);

console.log(bigboy.toString());
console.log(bigboy.volume());