import { Node } from './Node.ts';
import { Polygon } from './Polygon.ts';

/**
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 */
export class CSG {
    static fromPolygons(polygons: Polygon[]): CSG {
        const csg = new CSG();
        csg.polygons = polygons;
        return csg;
    }

    private polygons: Polygon[] = [];

    clone(): CSG {
        const csg = new CSG();
        csg.polygons = this.polygons
            .map((p) => p.clone())
            .filter((p) => Number.isFinite(p.plane.w));
        return csg;
    }

    toPolygons(): Polygon[] {
        return this.polygons;
    }

    union(csg: CSG): CSG {
        const a = new Node(this.clone().polygons);
        const b = new Node(csg.clone().polygons);
        a.clipTo(b);
        b.clipTo(a);
        b.invert();
        b.clipTo(a);
        b.invert();
        a.build(b.allPolygons());
        return CSG.fromPolygons(a.allPolygons());
    }

    subtract(csg: CSG): CSG {
        const a = new Node(this.clone().polygons);
        const b = new Node(csg.clone().polygons);
        a.invert();
        a.clipTo(b);
        b.clipTo(a);
        b.invert();
        b.clipTo(a);
        b.invert();
        a.build(b.allPolygons());
        a.invert();
        return CSG.fromPolygons(a.allPolygons());
    }

    intersect(csg: CSG): CSG {
        const a = new Node(this.clone().polygons);
        const b = new Node(csg.clone().polygons);
        a.invert();
        b.clipTo(a);
        b.invert();
        a.clipTo(b);
        b.clipTo(a);
        a.build(b.allPolygons());
        a.invert();
        return CSG.fromPolygons(a.allPolygons());
    }

    // Return a new CSG solid with solid and empty space switched. This solid is
    // not modified.
    inverse(): CSG {
        const csg = this.clone();
        for (const p of csg.polygons) {
            p.flip();
        }
        return csg;
    }
}
