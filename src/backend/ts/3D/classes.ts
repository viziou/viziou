import { nearlyEqual } from "../utils.ts";
type Pair<A, B> = [A, B];


class Point2D {
    private _x: number;
    private _y: number;

	constructor(x: number, y: number) {
		this._x = x;
		this._y = y;
	}

    /**
     * Getter x
     * @return {number}
     */
	public get x(): number {
		return this._x;
	}

    /**
     * Getter y
     * @return {number}
     */
	public get y(): number {
		return this._y;
	}

    public get xy(): { x: number; y: number } {
        return {x: this.x, y: this.y};
    }

    public translate(x: number, y: number): this;
    public translate(p: Point2D): this;
    public translate(x: unknown, y: unknown = null): this {
        if (typeof x === 'number' && typeof y === 'number') {
            this._x += x; this._y += y;
        } else if (x instanceof Point2D) {
            this._x += x.x; this._y += x.y;
        }
            // should probably throw exception if both failed
            return this;
    }

    public toList(): number[] {
        return [this._x, this._y];
    }

    public equals(point: Point2D): boolean {
        return nearlyEqual(this._x, point.x) && nearlyEqual(this._y, point.y);
    }

    public gre(point: Point2D): boolean {
        return this._x >= point.x && this._y >= point.y && !this.equals(point);
    }

    public less(point: Point2D): boolean {
        return this._x <= point.x && this._y <= point.y && !this.equals(point);
    }

    public geq(point: Point2D): boolean {
        return this._x >= point.x && this._y >= point.y;
    }

    public leq(point: Point2D): boolean {
        return this._x <= point.x && this._y <= point.y;
    }

    private _withinEdgeSegment(edge: Edge): boolean {
        return ((this._x >= edge.p.x && this._x <= edge.q.x) || (this._x >= edge.q.x && this._x <= edge.p.x)) &&
               ((this._y >= edge.p.y && this._y <= edge.q.y) || (this._y >= edge.q.y && this._y <= edge.p.y));
    }

    public onEdgeSegment(edge: Edge): boolean {
        // Determine if on the line defined by edge and within bounds
        const p = edge.p;
        const q = edge.q;

        // Get coefficients of line in form of Ax + By + C = 0
        const A = p.y - q.y;
        const B = q.x - p.x;
        const C = -(A*p.x + B*p.y);

        // Point is on the segment if within bounds and lies on line equation
        return this._withinEdgeSegment(edge) && nearlyEqual(A*this._x + B*this._y + C, 0);
    }

    public toString(): string {
        return `(${this._x},${this._y})`;
    }
}


interface Edge {
    p: Point2D;
    q: Point2D;
}


class Polygon2D {
    private _vertices: Point2D[];

    constructor(vertices: Point2D[], requiresSort?: boolean) {
        this._vertices = [...vertices];
        if (requiresSort) {
            this._vertices = this._sortCCW();
        }
    }

    /**
     * Getter vertices
     * @return {Point2D[]}
     */
	public get vertices(): Point2D[] {
		return [...this._vertices];
	}

    public get numVertices(): number {
        return this._vertices.length;
    }

    public getCentroid() {
        let x: number = 0;
        let y: number = 0;
        const numVertices: number = this.numVertices;

        // Add up all coordinates and divide by number of vertices to get centre spot
        for (let point of this._vertices) {
            x += point.x;
            y += point.y;
        }
        return new Point2D(x/numVertices, y/numVertices);
    }

    public translate(x: number, y: number): this;
    public translate(p: Point2D): this;
    public translate(x: number | Point2D, y?: number): this {
        if (!(x instanceof Point2D) && (y)) {
            x = new Point2D(x, y);
        }

        // this is necessary to keep TypeScript happy since we're doing funky things with types
        if (typeof x !== 'number') {
            this._vertices.map((point: Point2D) => {
            return point.translate(x);
            })
        }
        return this;
    }

    private _sortCCW() {
        // Obtain centre point to reference from
        const meanVertex: Point2D = this.getCentroid();

        // Get angle from positive x-axis of each point
        const angles: number[] = this._vertices.map((point) => {
            // Get angle point makes with reference to shifted polygon to origin
            let angle = Math.atan2(point.y - meanVertex.y, point.x - meanVertex.x);

            // Convert domain from (-pi, pi] to [0, 2*pi)
            if (angle < 0) {
                angle += 2*Math.PI;
            }
            return angle;
        })

        // Zip the points with key value of angle
        const collection: Pair<Point2D, number>[] = [];
        for (let i = 0; i < this._vertices.length; i++) {
            collection.push([this._vertices[i], angles[i]]);
        }

        // Sort based on key
        const sortedCollection = collection.sort((a, b) => {
            if (a[1] < b[1]) {
                return -1;
            } else if (a[1] == b[1]) {
                return 0;
            } else {
                return 1
            }
        });

        // Return an array only consisting of the points
        return sortedCollection.map((value) => {
            return value[0];
        })
    }

    public calculateArea(): number {
        let sum: number = 0;
        let p: Point2D;
        let q: Point2D;
        let edge: Edge;

        // Loop over every edge counterclockwise
        for (var i = 0; i < this._vertices.length; i++) {
            edge = this.getEdge(i)
            p = edge.p;
            q = edge.q;
            sum += (p.x*q.y - p.y*q.x);
        }
        return sum/2;
    }

    public contains(testPoint: Point2D): boolean {
        for (let point of this._vertices) {
            if (testPoint.equals(point)) {
                return true;
            }
        }
        return false;
    }

    public includes(testPoint: Point2D): boolean {
        // Iterate over every edge of the polygon in ccw order
        for (let i = 0; i < this._vertices.length; i++) {
            // Get edge
            let edge = this.getEdge(i)
            let p = edge.p;
            let q = edge.q;

            // Obtain line equation coefficients of edge
            let A = p.y - q.y;
            let B = q.x - p.x;
            let C = -(A*p.x + B*p.y);

            // Ensure y-coefficient is positive and if zero, x-coefficient is positive
            if (B < 0 || (B == 0 && A < 0)) {
                A *= -1;
                B *= -1;
                C *= -1;
            }

            // Get vector direction
            let dx = q.x - p.x;
            let dy = q.y - p.y;
            let angle = Math.atan2(dy, dx);

            // Perform inequality test and return early if point fails
            if (-Math.PI/2 <= angle && angle < Math.PI/2) {
                if (!(A*testPoint.x + B*testPoint.y + C >= 0)) {
                    return false;
                }
            } else {
                if (!(A*testPoint.x + B*testPoint.y + C <= 0)) {
                    return false;
                }
            }
        }

        // Return true if passes all inequalities
        return true;
    }

    public getEdge(idx: number): Edge {
        return {
            p: this._vertices[idx],
            q: this._vertices[(idx + 1) % this._vertices.length]
        };
    }

    public map(callbackfn: (point: Point2D) => Point2D): Polygon2D {
        return new Polygon2D(this._vertices.map(callbackfn));
    }

    public toString(): string {
        if (this._vertices.length == 0) {
            return "[]";
        }
        let str = "[";
        this._vertices.forEach((point) => {
            str += `${point.toString()} `;
        })
        str = str.slice(0, str.length-1);
        str += "]";
        return str;
    }
}


export { Point2D, Polygon2D };
export type { Edge };