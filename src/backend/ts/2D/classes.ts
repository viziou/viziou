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

class Polygon2D {
    private _vertices: Point2D[];

    constructor(vertices: Point2D[]) {
        this._vertices = [...vertices];
    }

    private _sortCCW() {
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

    public contains(point: Point2D): boolean {
        var count: number = 0;
        var p: Point2D;
        var q: Point2D;
        var xIntersect: number;

        // Loop over every edge of the polygon
        for (var i = 0; i < this._vertices.length; i++) {
            // Get points of edge
            p = this._vertices[i];
            q = this._vertices[(i + 1) % this._vertices.length];

            // Get intersection x-value of horizontal right ray of point with edge defined by p and q
            xIntersect = ((p.x - q.x) / (p.y - q.y)) * (point.y - p.y) + p.x

            // TODO: Fix to do vertical ray if the two points p and q are horizontal (currently leads to DivBy0 error)

            // Verify the conditions of ray and intersection of edge within boundaries
            // TODO: Investigate how intersection with endpoints of edges should be handled as to not accidentally count it twice
            //       when comparing with another edge sharing the same endpoint.
            if (xIntersect >= point.x && ((p.x < xIntersect && xIntersect < q.x) || (q.x < xIntersect && xIntersect < p.x)))
                count += 1;
        }
        return true;
    }
}


export default { Point2D, Polygon2D };