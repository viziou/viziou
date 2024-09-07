import { nearlyEqual } from "../utils.ts";
type Pair<A, B> = [A, B];


class Point3D {
    private _x: number;
    private _y: number;
    private _z: number;

	constructor(x: number, y: number, z: number) {
		this._x = x;
		this._y = y;
        this._z = z;
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

    /**
     * Getter z
     * @return {number}
     */
	public get z(): number {
		return this._z;
	}

    public translate(x: number, y: number, z: number): this;
    public translate(p: Point3D): this;
    public translate(x: unknown, y: unknown = null, z: unknown = null): this {
        if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
            this._x += x; this._y += y; this._z += z;
        } else if (x instanceof Point3D) {
            this._x += x.x; this._y += x.y; this._z += x.z;
        }
            // should probably throw exception if both failed
            return this;
    }

    public add(p: Point3D): Point3D {
        return new Point3D(this.x + p.x, this.y + p.y, this.z + p.z);
    }

    public subtract(p: Point3D): Point3D {
        return new Point3D(this.x - p.x, this.y - p.y, this.z - p.z);
    }

    public magnitude(): number {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2);
    }

    public normalise(): Point3D {
        const mag = this.magnitude();
        return new Point3D(this.x/mag, this.y/mag, this.z/mag);
    }

    public toList(): number[] {
        return [this._x, this._y, this._z];
    }

    public equals(point: Point3D): boolean {
        return nearlyEqual(this._x, point.x) && nearlyEqual(this._y, point.y) && nearlyEqual(this._z, point.z);
    }

    private _withinEdgeSegment(edge: Edge3D): boolean {
        return ((this._x >= edge.p.x && this._x <= edge.q.x) || (this._x >= edge.q.x && this._x <= edge.p.x)) &&
               ((this._y >= edge.p.y && this._y <= edge.q.y) || (this._y >= edge.q.y && this._y <= edge.p.y)) &&
               ((this._z >= edge.p.z && this._z <= edge.q.z) || (this._z >= edge.q.z && this._z <= edge.p.z));
    }

    public onEdgeSegment(edge: Edge3D): boolean {
        // Determine if on the line defined by edge and within bounds
        const p = edge.p;
        const q = edge.q;

        // Solve for the scalar t for each coordinate
        const tx = (this.x - p.x)/(p.x - q.x);
        const ty = (this.y - p.y)/(p.y - q.y);
        const tz = (this.z - p.z)/(p.z - q.z);

        // Point is on the segment if within bounds and all scalar t are same
        return this._withinEdgeSegment(edge) && nearlyEqual(tx, ty) && nearlyEqual(ty, tz) && nearlyEqual(tz, tx);
    }

    public toString(): string {
        return `(${this._x},${this._y},${this._z})`;
    }
}


interface Edge3D {
    p: Point3D;
    q: Point3D;
}


function cross(p: Point3D, q: Point3D): Point3D {
    return new Point3D(p.y*q.z - p.z*q.y, p.z*q.x - p.x*q.z, p.x*q.y - p.y*q.x);
}

function dot(p: Point3D, q: Point3D): number {
    return p.x*q.x + p.y*q.y + p.z*q.z;
}


class Face3D {
    private _vertices: Point3D[];
    private _normal: Point3D;

    constructor(vertices: Point3D[], requiresValidation?: boolean, requiresSort?: boolean) {
        this._vertices = [...vertices];
        this._normal = this.calculateNormal();

        // Validate if required
        if (requiresValidation) {
            if (!this._validateVertices()) {
                this._vertices = []     // TODO: Should throw some exception
            }
        }

        // Sort CCW order if required
        if (requiresSort) {
            this._sortCCW();
        }
    }

    /**
     * Getter vertices
     * @return {Point3D[]}
     */
	public get vertices(): Point3D[] {
		return [...this._vertices];
	}

    /**
     * Getter normal
     * @return {Point3D[]}
     */
	public get normal(): Point3D {
		return new Point3D(this._normal.x, this._normal.y, this._normal.z);
	}

    public invertNormal() {
        this._normal = new Point3D(-this.normal.x, -this.normal.y, -this.normal.z);
        this._sortCCW();
    }

    public get numVertices(): number {
        return this._vertices.length;
    }

    public calculateNormal(): Point3D {
        // Edge case of less than 3 vertex Face
        if (this.numVertices < 3) {
            return new Point3D(0, 0, 0);
        }
        
        // Establish points to use
        const Point1 = this._vertices[0];
        const Point2 = this._vertices[1];
        const Point3 = this._vertices[2];

        // Get parallel plane vectors
        const vec12 = Point2.subtract(Point1);
        const vec13 = Point3.subtract(Point1);

        // Get normal vector to plane
        const n = cross(vec12, vec13);

        return n.normalise();
    }

    public planeCoefficients(): number[] {
        // Get normal vector to plane
        const n = this.normal;

        // Create coefficients
        const A = n.x;
        const B = n.y;
        const C = n.z;
        const D = -1 * dot(n, this._vertices[0]);

        return [A, B, C, D];
    }

    private _validateVertices(): boolean {
        // All vertices must lie on the same plane, with a minimum of 3 vertices
        if (this._vertices.length < 3) {
            return false;
        }

        // Get plane equation based on first 3 vertices
        const coeffs = this.planeCoefficients()
        const A = coeffs[0];
        const B = coeffs[1];
        const C = coeffs[2];
        const D = coeffs[3];

        // Iterate over each vertex and verify it belongs on plane
        for (let i = 0; i < this.numVertices; i++) {
            if (!nearlyEqual(A*this._vertices[i].x + B*this._vertices[i].y + C*this._vertices[i].z + D, 0)) {
                // Vertex does not meet plane equation, therefore vertices are not valid
                return false;
            }
        }
        return true;
    }

    public centroid(): Point3D {
        let x: number = 0;
        let y: number = 0;
        let z: number = 0;
        const numVertices: number = this.numVertices;

        // Add up all coordinates and divide by number of vertices to get centre spot
        for (let point of this._vertices) {
            x += point.x;
            y += point.y;
            z += point.z
        }
        return new Point3D(x/numVertices, y/numVertices, z/numVertices);
    }

    private _sortCCW() {
        if (this._vertices.length < 3) {
            // Sorting is meaningless
            return this._vertices;
        }

        // Obtain centre point to reference from
        const meanVertex: Point3D = this.centroid();

        // Redefine coordinate system to put face on 2D x-y plane
        const coordinates: Pair<number, number>[] = [[1, 0]];

        // Set new x-direction component vector
        const x = this._vertices[0].subtract(meanVertex);
        const x_mag = x.magnitude();
        const x_hat = x.normalise();

        // Set new y-direction component vector by taking cross product face normal and x. This order ensures anticlockwise x and y 
        const y = cross(this.normal, x);
        const y_mag = y.magnitude();
        const y_hat = y.normalise();

        // Redefine all centroid vectors in terms of x and y via scalar resolute
        for (let i = 1; i < this.numVertices; i++) {
            let a = this._vertices[i].subtract(meanVertex);
            let u_mag = dot(a, x_hat);
            let w_mag = dot(a, y_hat);
            coordinates.push([u_mag/x_mag, w_mag/y_mag]);
        }

        // Get angle from positive x-axis of each point based on redefined coordinates
        const angles: number[] = coordinates.map((coordinate) => {
            // Get angle point makes with reference new horizontal
            let angle = Math.atan2(coordinate[1], coordinate[0]);

            // Convert domain from (-pi, pi] to [0, 2*pi)
            if (angle < 0) {
                angle += 2*Math.PI;
            }
            return angle;
        })
        

        // Zip the points with key value of angle
        const collection: Pair<Point3D, number>[] = [];
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

        // Set an array only consisting of the points
        this._vertices = sortedCollection.map((value) => {
            return value[0];
        })
    }

    public translate(x: number, y: number, z: number): this;
    public translate(p: Point3D): this;
    public translate(x: number | Point3D, y?: number, z?: number): this {
        if (!(x instanceof Point3D) && (y) && (z)) {
            x = new Point3D(x, y, z);
        }

        // this is necessary to keep TypeScript happy since we're doing funky things with types
        if (typeof x !== 'number') {
            this._vertices.map((point: Point3D) => {
            return point.translate(x);
            })
        }
        return this;
    }

    public area(): number {
        let sum: number = 0;
        let p: Point3D;
        let q: Point3D;
        let edge: Edge3D;
        let side1: Point3D;
        let side2: Point3D;
        let meanVertex = this.centroid();

        // Loop over every edge counterclockwise
        for (var i = 0; i < this._vertices.length; i++) {
            // Get position vector of the endpoint of the edge
            edge = this.getEdge(i)
            p = edge.p;
            q = edge.q;

            // Get side vectors of the triangle created with the centroid
            side1 = p.subtract(meanVertex);
            side2 = q.subtract(meanVertex);

            // Get area of triangle of the two vectors
            sum += cross(side1, side2).magnitude()/2;
        }
        return sum;
    }

    public getEdge(idx: number): Edge3D {
        return {
            p: this._vertices[idx],
            q: this._vertices[(idx + 1) % this._vertices.length]
        };
    }

    public map(callbackfn: (point: Point3D) => Point3D): Face3D {
        return new Face3D(this._vertices.map(callbackfn), true);
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


class Polyhedra3D {
    private _faces: Face3D[];

    constructor(faces: Face3D[]) {
        // Save a copy of the faces
        this._faces = [...faces];

        // Renormalise faces to all have outward normals
        this.renormalise();
    }

    /**
     * Getter faces
     * @return {Face3D[]}
     */
	public get faces(): Face3D[] {
		return [...this._faces];
	}

    public get numFaces(): number {
        return this.faces.length;
    }

    public get numVertices(): number {
        return 1;   // TODO FIGURE THIS OUT
    }

    public centroid(): Point3D {
        let sumPoint = new Point3D(0, 0, 0);
        for (let i = 0; i < this.numFaces; i++) {
            sumPoint = sumPoint.add(this.faces[i].centroid());
        }
        return new Point3D(sumPoint.x/this.numFaces, sumPoint.y/this.numFaces, sumPoint.z/this.numFaces);
    }

    public renormalise() {
        // Get centroid
        const polyhedraCentroid = this.centroid();

        // Go over every face
        this._faces.forEach((face) => {
            // Get face centroid to polyhedra centroid vector
            let centreVector = polyhedraCentroid.subtract(face.centroid())

            // Compute scalar product of centre vector with respect to the normal
            let scalarProduct = dot(centreVector, face.normal);

            // If positive, means the normal is facing inwards
            if (scalarProduct > 0) {
                face.invertNormal();
            }
        });
    }

    public volume(): number {
        // Iterate over every face and create a pyramid with it, with apex of centroid,
        // and calculate its volume and add to a running total
        if (this.numFaces < 4) {
            return 0;
        }
        let sum = 0;
        let meanVertex = this.centroid();
        for (let i = 0; i < this.numFaces; i++) {
            let face = this.faces[i];

            // Get base area
            let baseArea = face.area();

            // Get perpendicular height to apex by getting normal vector of face and 
            // doing scalar resolute with any slant vector
            let n = face.normal;
            let slantVector = meanVertex.subtract(face.vertices[0]);
            let height = Math.abs(dot(slantVector, n));

            // Add volume to total
            sum += 1/3 * baseArea * height;
        }

        return sum;
    }

    public map(callbackfn: (point: Point3D) => Point3D): Polyhedra3D {
        return new Polyhedra3D(this._faces.map((face) => face.map(callbackfn)));
    }

    public toString(): string {
        if (this._faces.length == 0) {
            return "[]";
        }
        let str = "[\n";
        this._faces.forEach((face) => {
            str += `\t${face.toString()}\n`;
        });
        str += "]";
        return str;
    }
}

export { Point3D, Face3D, Polyhedra3D };
export type { Edge3D };