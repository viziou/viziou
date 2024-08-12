import { nearlyEqual } from "./utils.ts";
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
    
    public withinEdgeSegment(edge: Edge): boolean {
        return ((this._x >= edge.p.x && this._x <= edge.q.x) || (this._x >= edge.q.x && this._x <= edge.p.x)) &&
               ((this._y >= edge.p.y && this._y <= edge.q.y) || (this._y >= edge.q.y && this._y <= edge.p.y)) &&
               !this.equals(edge.q);
    }

    public onEdgeSegment(edge: Edge): boolean {
        // Determine if on the line defined by edge and within bounds
        var p = edge.p;
        var q = edge.q;

        // Get coefficients of line in form of Ax + By + C = 0
        var A = p.y - q.y;
        var B = q.x - p.x;
        var C = -(A*p.x + B*p.y);

        // Point is on the segment if within bounds and lies on line equation
        return this.withinEdgeSegment(edge) && nearlyEqual(A*this._x + B*this._y + C, 0);
    }

    public toString(): string {
        return `(${this._x},${this._y})`;
    }
}

interface Edge {
    p: Point2D;
    q: Point2D;
}

// TODO: Enforce conditions on Polygon requiring >= 3 vertices
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

    public getCentroid() {
        var x: number = 0;
        var y: number = 0;
        var numVertices: number = this.getNumVertices();

        // Add up all coordinates and divide by number of vertices to get centre spot
        for (var point of this._vertices) {
            x += point.x;
            y += point.y;
        }
        return new Point2D(x/numVertices, y/numVertices);
    }

    private _sortCCW() {
        // Obtain centre point to reference from
        var meanVertex: Point2D = this.getCentroid();

        // Get angle from positive x-axis of each point
        var angles: number[] = this._vertices.map((point) => {
            // Get angle point makes with reference to shifted polygon to origin 
            var angle = Math.atan2(point.y - meanVertex.y, point.x - meanVertex.x);

            // Convert domain from (-pi, pi] to [0, 2*pi)
            if (angle < 0) {
                angle += 2*Math.PI;
            }
            return angle;
        })

        // Zip the points with key value of angle
        var collection: Pair<Point2D, number>[] = [];
        for (var i = 0; i < this._vertices.length; i++) {
            collection.push([this._vertices[i], angles[i]]);
        }

        // Sort based on key
        var sortedCollection = collection.sort((a, b) => {
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

    public getNumVertices(): number {
        return this._vertices.length;
    }

    public calculateArea(): number {
        var sum: number = 0;
        var p: Point2D;
        var q: Point2D;

        // Loop over every edge counterclockwise
        for (var i = 0; i < this._vertices.length; i++) {
            var edge = this.getEdge(i)
            var p = edge.p;
            var q = edge.q;
            sum += (p.x*q.y - p.y*q.x);
        }
        return sum/2;
    }

    public contains(testPoint: Point2D): boolean {
        for (var point of this._vertices) {
            if (testPoint.equals(point)) {
                return true;
            }
        }
        return false;
    }

    public includes(testPoint: Point2D): boolean {
        // Iterate over every edge of the polygon in ccw order
        for (var i = 0; i < this._vertices.length; i++) {
            // Get edge
            var edge = this.getEdge(i)
            var p = edge.p;
            var q = edge.q;

            // Obtain line equation coefficients of edge
            var A = p.y - q.y;
            var B = q.x - p.x;
            var C = -(A*p.x + B*p.y);

            // Ensure y-coefficient is positive and if zero, x-coefficient is positive
            if (B < 0 || (B == 0 && A < 0)) {
                A *= -1;
                B *= -1;
                C *= -1;
            }

            // Get vector direction
            var dx = q.x - p.x;
            var dy = q.y - p.y;
            var angle = Math.atan2(dy, dx);

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
        var str = "[";
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