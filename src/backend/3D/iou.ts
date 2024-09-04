import { Point3D, Face3D, Polyhedra3D } from './classes.ts';
import { CSG } from 'three-csg-ts';
import { Polygon } from 'three-csg-ts/lib/esm/Polygon';
import { Vertex } from 'three-csg-ts/lib/esm/Vertex';
import { Vector } from 'three-csg-ts/lib/esm/Vector';


function getIntersectionPolyhedra(polyhedra1: Polyhedra3D, polyhedra2: Polyhedra3D): Polyhedra3D {
    // Convert both input polyhedra into CSG solids
    const csg1 = PolyehdraToCSG(polyhedra1);
    const csg2 = PolyehdraToCSG(polyhedra2);

    // Get intersection solid
    const intersectCSG = csg1.intersect(csg2);

    // Convert CSG solid back into polyhedra format
    return CSGToPolyhedra(intersectCSG);
}


function PolyehdraToCSG(polyehdra: Polyhedra3D): CSG {
    const polygons: Polygon[] = [];
    polyehdra.faces.forEach((face) => {
        let normal = face.normal();
        polygons.push(new Polygon(face.vertices.map((point) => {
            return new Vertex(
                new Vector(point.x, point.y, point.z),
                new Vector(normal.x, normal.y, normal.z),
                new Vector(0, 0, 0),
                new Vector(0, 0, 0)
            );
        }), null))
    });
    return CSG.fromPolygons(polygons)
}


function CSGToPolyhedra(csg: CSG): Polyhedra3D {
    const polygons = csg.toPolygons();
    const faces: Face3D[] = [];
    polygons.forEach((polygon) => {
        faces.push(new Face3D(polygon.vertices.map((vertex) => {
            return new Point3D(
                vertex.pos.x,
                vertex.pos.y,
                vertex.pos.z
            );
        }), true, true))
    });
    return new Polyhedra3D(faces);
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