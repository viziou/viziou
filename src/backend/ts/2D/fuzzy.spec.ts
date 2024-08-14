import { describe, it} from "mocha";
import { should as setupShould } from "chai";
import { Edge, Point2D, Polygon2D } from "./classes.ts";
import { getIntersectionPolygon, IoU } from "./iou.ts";
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
    it("should follow f(x) = x^2 curve")

  })

  describe("Expanding Triangle Test", () => {
    it("should follow f(x) = (x^2)/2 curve")

  })

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
