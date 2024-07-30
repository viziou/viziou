import {assert, expect} from "chai";
import {test, describe, it} from "mocha";

/* Chai has many different testing styles, including more traditional unit tests as well as more flavourful variants.
* See https://www.chaijs.com/guide/styles/ for general info, and https://www.chaijs.com/api/bdd/ for more specifics
* on the BDD styles (expect and should).
* */

test("simple math", ()=>{
    const x = 1 + 2;
    assert.equal(x, 3); // 'traditional assert' style
})

// "chai" BDD style
describe("more math tests", () => {
    it("assert with expect-style", () => {
        const x = 999;
        expect(x-x).to.equal(0)
        expect(x-x).is.false // 'to' and 'is' are language chains for readability
    })

    it("assert with should-style", () => {
        const x = 3**2;
        x.should.be.a('number')
        x.should.equal(9)
    })
})
