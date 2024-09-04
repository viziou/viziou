import { Point3D, Edge3D, Face3D, Polyhedra3D } from './classes.ts';


function getIntersectionPolyhedra(polyhedra1: Polyhedra3D, polyhedra2: Polyhedra3D): Polyhedra3D {
    return new Polyhedra3D([]);
}


function IoU(polyhedra1: Polyhedra3D, polyhedra2: Polyhedra3D): number {
    const volumeOfIntersection: number = getIntersectionPolyhedra(polyhedra1, polyhedra2).volume();
    const volumeOfUnion = polyhedra1.volume() + polyhedra2.volume() - volumeOfIntersection;
    if (volumeOfUnion == 0) {
        return 0;
    } else {
        return volumeOfIntersection / volumeOfUnion;
    }
}


export { getIntersectionPolyhedra, IoU };