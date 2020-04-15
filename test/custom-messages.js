"use strict";
require("./support/setup.js");
var shouldPass = require("./support/common.js").shouldPass;
var shouldFail = require("./support/common.js").shouldFail;

describe("Custom messages", function () {
    var promise = null;
    var message = "He told me enough! He told me you killed him!";

    beforeEach(function () {
        promise = Promise.resolve(42);
    });

    describe("should pass through for .become(value, message) for 42", function () {
        shouldPass(function () { return promise.should.become(42, message); });
    });
    describe("should pass through for .become(value, message) for 52", function () {
        shouldFail({
            op: function () { return promise.should.become(52, message); },
            message: message
        });
    });

    describe("should pass through for .not.become(42, message)", function () {
        shouldFail({
            op: function () { return promise.should.not.become(42, message); },
            message: message
        });
    });
    describe("should pass through for .not.become(52, message)", function () {
        shouldPass(function () { return promise.should.not.become(52, message); });
    });

    describe("should pass through for .eventually.equal(42)", function () {
        shouldPass(function () { return promise.should.eventually.equal(42, message); });
    });
    describe("should pass through for .not.eventually.equal(42)", function () {
        shouldFail({
            op: function () { return promise.should.not.eventually.equal(42, message); },
            message: message
        });
    });
});
