import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Edge, Point2D, Polygon2D } from "./classes.ts";
import { getIntersectionPolygon, IoU } from "./iou.ts";
import { abs, sqrt } from 'mathjs'
import { nearlyEqual } from './utils.ts'
const should = setupShould();

// Fuzzy
describe("Fuzzing Tests", () => {
  describe("Random Polygon Translation Transitive", () => {
    it("should have the same area every time")

  })

  describe("Random Polygon Rotation Transitive", () => {
    it("should have the same area every time")

  })

  describe("Random Polygon Translation + Rotation Transitive", () => {
    it("should have the same area every time")

  })

  describe("Expanding Square Test", () => {
    // Generate an array of tests (lazy)
    const MAX_SIZE = 1000
    const STEP_SIZE = 0.01

    function* generateTests() {
      for (let i = 0; i < MAX_SIZE; i += STEP_SIZE) {
        yield {'polygon': new Polygon2D([
            new Point2D(0, 0),
            new Point2D(i, 0),
            new Point2D(i, i),
            new Point2D(0, i)
          ]),
          'expectedArea': i**2}
      }
    }

    const generator = generateTests()

    it("should follow f(x) = x^2 curve", () => {
    for (const {polygon, expectedArea} of generator) {
      const calculated = polygon.calculateArea();
      calculated.should.be.equal(expectedArea);
      }
    });
  });

  describe("Expanding Triangle Test", () => {
    // Generate an array of tests (lazy)
    const MAX_SIZE = 1000
    const STEP_SIZE = 0.01

    function* generateTests() {
      for (let i = 0; i < MAX_SIZE; i += STEP_SIZE) {
        yield {'polygon': new Polygon2D([
            new Point2D(i/2, 0),
            new Point2D(0, i),
            new Point2D(-i/2, 0)
          ]),
          'expectedArea': (i**2)/2}
      }
    }

    const generator = generateTests()

    it("should follow f(x) = (x^2)/2 curve", () => {
      for (const {polygon, expectedArea} of generator) {
        const calculated = polygon.calculateArea();
        calculated.should.be.equal(expectedArea);
      }
    });
  });

  describe("Circle PI Test", () => {
    // 1 = x^2 + y^2  ->  y = sqrt(1-x^2)
    const STEP_SIZE = 0.00001 // (1/0.001)*4 = 400000 points
    const points: Point2D[] = []
    // right to up to left
    for (let x = 1; x >= -1; x -= STEP_SIZE) {
      points.push(new Point2D(x, Math.sqrt(1 - x**2)))
    }
    // left to down to right
    for (let x = -1; x <= 1; x += STEP_SIZE) {
      points.push(new Point2D(x, -Math.sqrt(1 - x**2)))
    }

    const approximateCircle = new Polygon2D(points);

    it("should approximately equal pi", () => {
      approximateCircle.calculateArea().should.be.closeTo(Math.PI, 1e-5)
    })

  })

  describe("Null Behaviour - Single Point", () => {
    it("should equal 0", () => {

    })
  })

  describe("Null Behaviour - Single Line", () => {
    it("should equal 0", () => {

    })
  })

  describe("Identical Vertices", () => {
    it("should equal 0", () => {

    })
  })

})
