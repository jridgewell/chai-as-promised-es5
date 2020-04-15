"use strict";
require("./support/setup.js");
var chaiAsPromised = require("..");
var originalTransferPromiseness = require("..").transferPromiseness;

describe("Configuring the way in which promise-ness is transferred", function () {
    afterEach(function () {
        chaiAsPromised.transferPromiseness = originalTransferPromiseness;
    });

    it("should return a promise with the custom modifications applied", function () {
        chaiAsPromised.transferPromiseness = function (assertion, promise) {
            assertion.then = promise.then.bind(promise);
            assertion.isCustomized = true;
        };

        var promise = Promise.resolve("1234");
        var assertion = promise.should.become("1234");

        assertion.should.have.property("isCustomized", true);
    });
});
