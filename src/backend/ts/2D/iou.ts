import { Point2D, Edge, Polygon2D } from './classes.ts';
import { intersect } from 'mathjs';

function getIntersectionPolygon(polygon1: Polygon2D, polygon2: Polygon2D): Polygon2D {
    // Initialise point list for final polygon
    var points: Point2D[] = [];

    // Find all the points from polygon1 inside polygon2
    for (var point of polygon1.vertices) {
        if (polygon2.includes(point)) {
            points.push(point);
        }
    }

    // Find all the points from polygon2 inside polygon1
    for (var point of polygon2.vertices) {
        // Additional check to not include point if it is also a vertex of polygon1
        if (!polygon1.contains(point) && polygon1.includes(point)) {
            points.push(point);
        }
    }

    // For all edge pairs see if there is any valid intersection
    for (var i = 0; i < polygon1.numVertices; i++) {
        for (var j = 0; j < polygon2.numVertices; j++) {
            var pointInt = findIntersectionPoint(polygon1.getEdge(i), polygon2.getEdge(j));
            if (pointInt && !(polygon1.contains(pointInt) || polygon2.contains(pointInt)) ) {
                points.push(pointInt);
            }
        }
    }

    // Create new Polygon object
    return new Polygon2D(points, true);
}

function findIntersectionPoint(edge1: Edge, edge2: Edge): Point2D | null {
    // Get intersection point
    var intersectionPoint = intersect(edge1.p.toList(), edge1.q.toList(), edge2.p.toList(), edge2.q.toList());
    
    // Process point whether valid or not
    if (intersectionPoint === null) {
        // None or infinite solutions
        // In the case of overlapping, such points would have been found in the polygon inclusion test
        return null;
    } else {
        var pointInt = new Point2D(Number(intersectionPoint[0]), Number(intersectionPoint[1]));
        // Check bounds for elligible point
        if (pointInt.onEdgeSegment(edge1) && pointInt.onEdgeSegment(edge2)) {
            return pointInt;
        } else {
            return null;
        }
    }
}

function IoU(polygon1: Polygon2D, polygon2: Polygon2D): number {
    var areaOfIntersection: number = getIntersectionPolygon(polygon1, polygon2).calculateArea();
    return areaOfIntersection / (polygon1.calculateArea() + polygon2.calculateArea() - areaOfIntersection);
}

export { getIntersectionPolygon, IoU };