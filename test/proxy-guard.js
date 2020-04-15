"use strict";
var chai = require("chai");
var chaiAsPromised = require("..");

chai.should();
chai.use(chaiAsPromised);

function shouldGuard(fn, msg) {
    fn.should.throw("Invalid Chai property: " + msg);
}

describe("Proxy guard", function () {
    var number = 42;
    var promise = Promise.resolve(42);

    before(function () {
        if (typeof Proxy === "undefined" || typeof Reflect === "undefined" || chai.util.proxify === undefined) {
            /* eslint-disable no-invalid-this */
            this.skip();
            /* eslint-enable no-invalid-this */
        }
    });

    it("should guard against invalid property following `.should`", function () {
        shouldGuard(function () { return number.should.pizza; }, "pizza");
    });

    it("should guard against invalid property following overwritten language chain", function () {
        shouldGuard(function () { return number.should.to.pizza; }, "pizza");
    });

    it("should guard against invalid property following overwritten property assertion", function () {
        shouldGuard(function () { return number.should.ok.pizza; }, "pizza");
    });

    it("should guard against invalid property following uncalled overwritten method assertion", function () {
        shouldGuard(function () { return number.should.equal.pizza; }, "equal.pizza. See docs");
    });

    it("should guard against invalid property following called overwritten method assertion", function () {
        shouldGuard(function () { return number.should.equal(number).pizza; }, "pizza");
    });

    it("should guard against invalid property following uncalled overwritten chainable method assertion", function () {
        shouldGuard(function () { return number.should.a.pizza; }, "pizza");
    });

    it("should guard against invalid property following called overwritten chainable method assertion", function () {
        shouldGuard(function () { return number.should.a("number").pizza; }, "pizza");
    });

    it("should guard against invalid property following `.eventually`", function () {
        shouldGuard(function () { return promise.should.eventually.pizza; }, "pizza");
    });

    it("should guard against invalid property following `.fulfilled`", function () {
        shouldGuard(function () { return promise.should.fulfilled.pizza; }, "pizza");
    });

    it("should guard against invalid property following `.rejected`", function () {
        shouldGuard(function () { return promise.should.rejected.pizza; }, "pizza");
    });

    it("should guard against invalid property following called `.rejectedWith`", function () {
        shouldGuard(function () { return promise.should.rejectedWith(42).pizza; }, "pizza");
    });

    it("should guard against invalid property following uncalled `.rejectedWith`", function () {
        shouldGuard(function () { return promise.should.rejectedWith.pizza; }, "rejectedWith.pizza. See docs");
    });

    it("should guard against invalid property following called `.become`", function () {
        shouldGuard(function () { return promise.should.become(42).pizza; }, "pizza");
    });

    it("should guard against invalid property following uncalled `.become`", function () {
        shouldGuard(function () { return promise.should.become.pizza; }, "become.pizza. See docs");
    });
});
