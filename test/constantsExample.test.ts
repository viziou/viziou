import { describe, it } from "mocha";
import { should as setupShould } from "chai";
const should = setupShould();

import { aVeryImportantConstant } from './constantsExample';
describe("aVeryImportantConstant math tests #1", () => {
    it("should be equal to 3", () => {
        aVeryImportantConstant.should.equal(3);
    })
})
