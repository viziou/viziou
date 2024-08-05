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
        return this._x == point.x && this._y == point.y;
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
            this._sortCCW();
        }
    }

    /**
     * Getter vertices
     * @return {Point2D[]}
     */
	public get vertices(): Point2D[] {
		return [...this._vertices];
	}

    public getMeanVertex() {
        var x: number = 0;
        var y: number = 0;
        for (var point of this._vertices) {
            x += point.x;
            y += point.y;
        }
        return new Point2D(x, y);
    }

    private _sortCCW() {
        // Obtain centre point to reference from
        var meanVertex: Point2D = this.getMeanVertex();

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

        // Loop over every consecutive pair of vertices in counterclockwise
        for (var i = 0; i < this._vertices.length; i++) {
            p = this._vertices[i];
            q = this._vertices[(i + 1) % this._vertices.length];
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
        var flag1: boolean = false;
        var flag2: boolean = false;
        var p: Point2D;
        var q: Point2D;

        // Loop over every edge of the polygon and do right ray test
        for (var i = 0; i < this._vertices.length; i++) {
            // Get points of edge
            p = this._vertices[i];
            q = this._vertices[(i + 1) % this._vertices.length];

            // Verify that testPoint.y is in the range defined by the endpoints p (inc) and q (exc) y-coordinate
            if ((p.y > testPoint.y && q.y < testPoint.y) || (p.y < testPoint.y && q.y > testPoint.y)
                && (testPoint.x <= (p.x - q.x)*(testPoint.y - p.y)/(p.y - q.y) + p.x)) {
                flag1 = !flag1;
            }
        }

        // Loop over every edge of the polygon and do left ray test
        for (var i = 0; i < this._vertices.length; i++) {
            // Get points of edge
            p = this._vertices[i];
            q = this._vertices[(i + 1) % this._vertices.length];

            // Verify that testPoint.y is in the range defined by the endpoints p (inc) and q (exc) y-coordinate
            if ((p.y > testPoint.y && q.y < testPoint.y) || (p.y < testPoint.y && q.y > testPoint.y)
                && (testPoint.x >= (p.x - q.x)*(testPoint.y - p.y)/(p.y - q.y) + p.x)) {
                flag2 = !flag2;
            }
        }

        // Both tests must return same true for point to be considered inside the polygon
        return flag1 || flag2;
    }

    public getEdge(idx: number): Edge {
        return {
            p: this._vertices[idx],
            q: this._vertices[(idx + 1) % this._vertices.length]
        };
    }
}


export { Point2D, Polygon2D };
export type { Edge };