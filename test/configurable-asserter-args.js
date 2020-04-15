"use strict";
require("./support/setup.js");
var chaiAsPromised = require("..");
var originalTransformAsserterArgs = require("..").transformAsserterArgs;

describe("Configuring the way in which asserter arguments are transformed", function () {
    beforeEach(function () {
        chaiAsPromised.transformAsserterArgs = function (args) { return Promise.all([].slice.call(args)); };
    });

    afterEach(function () {
        chaiAsPromised.transformAsserterArgs = originalTransformAsserterArgs;
    });

    it("should override transformAsserterArgs and allow to compare promises", function () {
        var value = "test it";

        return Promise.resolve(value).should.eventually.equal(Promise.resolve(value));
    });

    it("should override transformAsserterArgs and wait until all promises are resolved", function () {
        return Promise.resolve(5).should.eventually.be.within(Promise.resolve(3), Promise.resolve(6));
    });

    it("should not invoke transformAsserterArgs for chai properties", function () {
        chaiAsPromised.transformAsserterArgs = function () {
            throw new Error("transformAsserterArgs should not be called for chai properties");
        };

        return Promise.resolve(true).should.eventually.be.true;
    });

    it("should transform asserter args", function () {
        chaiAsPromised.transformAsserterArgs = function (args) {
            return [].slice.call(args).map(function (x) { return x + 1; });
        };

        return Promise.resolve(3).should.eventually.equal(2);
    });
});
