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
}

// TODO: Enforce conditions on Polygon requiring >= 3 vertices

class Polygon2D {
    private _vertices: Point2D[];

    constructor(vertices: Point2D[]) {
        this._vertices = [...vertices];
    }

    private _sortCW() {
        return
    }

    public getNumVertices(): number {
        return this._vertices.length;
    }

    public calculateArea(): number {
        var sum: number = 0;
        var p: Point2D;
        var q: Point2D;

        // Loop over every consecutive pair of vertices in counterclockwise
        for (var i = 0; i < this._vertices.length; i++) {
            p = this._vertices[i];
            q = this._vertices[(i + 1) % this._vertices.length];
            sum += (p.x*q.y - p.y*q.x);
        }
        return sum/2;
    }

    public contains(testPoint: Point2D): boolean {
        var flag: boolean = false;
        var p: Point2D;
        var q: Point2D;

        // Loop over every edge of the polygon
        for (var i = 0; i < this._vertices.length; i++) {
            // Get points of edge
            p = this._vertices[i];
            q = this._vertices[(i + 1) % this._vertices.length];

            // Special case check of when ray directly hits the inclusive p coordinate. This case
            // will help resolve situations when the horizontal ray is on top of an edge.
            if (testPoint.y == p.y && testPoint.x < p.x) {
                flag = !flag;
            }
            // Verify that testPoint.y is in the range defined by the endpoints p (inc) and q (exc) y-coordinate
            else if ((p.y > testPoint.y && q.y < testPoint.y) || (p.y < testPoint.y && q.y > testPoint.y)
                && (testPoint.x < (p.x - q.x)*(testPoint.y - p.y)/(p.y - q.y) + p.x)) {
                flag = !flag;
            }
        }
        return flag;
    }
}


export default { Point2D, Polygon2D };