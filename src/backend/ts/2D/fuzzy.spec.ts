import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Edge, Point2D, Polygon2D } from "./classes.ts";
import { getIntersectionPolygon, IoU } from "./iou.ts";
import { abs } from 'mathjs'
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
    it("should approximately equal pi")

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
