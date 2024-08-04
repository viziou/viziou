/* This is our testing framework. */
import {test, describe, it} from "mocha";

/* This is our assertion library. */
import {assert, expect, should as setupShould} from "chai";
// This modifies Object.prototype. Assigning to an attribute is only necessary if you want to put the 'should' keyword
// before an attribute, which is sometimes necessary (see line 36)
const should = setupShould();

/* Chai has many different testing styles, including more traditional unit tests as well as more flavourful variants.
* See https://www.chaijs.com/guide/styles/ for general info, and https://www.chaijs.com/api/bdd/ for more specifics
* on the BDD styles (expect and should).
* */

// traditional mocha test style
test("simple math", ()=> {
    const x = 1 + 2;
    assert.equal(x, 3); // traditional assert style
    assert.isAtLeast(x,0);
    assert.exists(x); // NOTE: existence tests cannot be done with the 'should' keyword because they inherently error
})

// modern mocha style + chai BDD style
describe("more math tests", () => {
    it("assert with expect-style", () => {
        const x = 999;
        expect(x-x).to.equal(0)
        expect(!!(x-x)).is.false // 'to' and 'is' are language chains for readability
    })

    it("assert with should-style", () => {
        const x = 3**2;
        // notice how with 'should' framework,
        x.should.be.a('number');
        x.should.equal(9);
        should.exist(x)
    })
})
