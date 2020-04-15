"use strict";
require("./support/setup.js");
var shouldPass = require("./support/common.js").shouldPass;
var shouldFail = require("./support/common.js").shouldFail;
var assert = require("chai").assert;
var expect = require("chai").expect;

describe("Assert interface with eventually extender:", function () {
    var promise = null;

    describe("Direct tests of fulfilled promises", function () {
        it(".eventually.isNull(promise)", function (done) {
            assert.eventually.isNull(Promise.resolve(null)).notify(done);
        });
        it(".eventually.isFunction(promise)", function (done) {
            assert.eventually.isFunction(Promise.resolve(function () { /* Forever pending */ })).notify(done);
        });
        it(".eventually.typeOf(promise, 'string')", function (done) {
            assert.eventually.typeOf(Promise.resolve("hello"), "string").notify(done);
        });
        it(".eventually.include(promiseForString, 'substring')", function (done) {
            assert.eventually.include(Promise.resolve("hello"), "hell").notify(done);
        });
        it(".eventually.include(promiseForArray, arrayMember)", function (done) {
            assert.eventually.include(Promise.resolve([1, 2, 3]), 1).notify(done);
        });
    });

    describe("On a promise fulfilled with the number 42", function () {
        beforeEach(function () {
            promise = Promise.resolve(42);
        });

        describe(".eventually.isNull(promise)", function () {
            shouldFail({
                op: function () { return assert.eventually.isNull(promise); },
                message: "to equal null"
            });
        });
        describe(".eventually.isDefined(promise)", function () {
            shouldPass(function () { return assert.eventually.isDefined(promise); });
        });
        describe(".eventually.ok(promise)", function () {
            shouldPass(function () { return assert.eventually.ok(promise); });
        });
        describe(".eventually.equal(promise, 42)", function () {
            shouldPass(function () { return assert.eventually.equal(promise, 42); });
        });
        describe(".eventually.equal(promise, 52)", function () {
            shouldFail({
                op: function () { return assert.eventually.equal(promise, 52); },
                message: "to equal 52"
            });

            function shouldFailWithCorrectActual(promiseProducer) {
                it("should return a promise rejected with an assertion error that has actual/expected properties " +
                   "correct", function (done) {
                    expect(promiseProducer().then(
                        function () {
                            throw new Error("promise fulfilled");
                        },
                        function (e) {
                            e.actual.should.equal(42);
                            e.expected.should.equal(52);
                        }
                    )).to.be.fulfilled.notify(done);
                });
            }

            describe("assert", function () {
                shouldFailWithCorrectActual(function () { return assert.eventually.equal(promise, 52); });
            });
            describe("expect", function () {
                shouldFailWithCorrectActual(function () { return expect(promise).to.eventually.equal(52); });
            });
            describe("should", function () {
                shouldFailWithCorrectActual(function () { return promise.should.eventually.equal(52); });
            });
        });

        describe(".eventually.notEqual(promise, 42)", function () {
            shouldFail({
                op: function () { return assert.eventually.notEqual(promise, 42); },
                message: "to not equal 42"
            });
        });
        describe(".eventually.notEqual(promise, 52)", function () {
            shouldPass(function () { return assert.eventually.notEqual(promise, 52); });
        });
    });

    describe("On a promise fulfilled with { foo: 'bar' }", function () {
        beforeEach(function () {
            promise = Promise.resolve({ foo: "bar" });
        });

        describe(".eventually.equal(promise, { foo: 'bar' })", function () {
            shouldFail({
                op: function () { return assert.eventually.equal(promise, { foo: "bar" }); },
                message: "to equal { foo: 'bar' }"
            });
        });
        describe(".eventually.deepEqual(promise, { foo: 'bar' })", function () {
            shouldPass(function () { return assert.eventually.deepEqual(promise, { foo: "bar" }); });
        });
    });

    describe("Assertion messages", function () {
        var message = "He told me enough! He told me you killed him!";

        describe("should pass through for .eventually.isNull(promise, message) for fulfilled", function () {
            shouldFail({
                op: function () { return assert.eventually.isNull(Promise.resolve(42), message); },
                message: message
            });
        });

        describe("should pass through for .eventually.isNull(promise, message) for rejected", function () {
            shouldFail({
                op: function () { return assert.eventually.isNull(Promise.reject(), message); },
                message: message
            });
        });

        describe("should pass through for .eventually.equal(promise, 52, message) for fulfilled", function () {
            shouldFail({
                op: function () { return assert.eventually.equal(Promise.resolve(42), 52, message); },
                message: message
            });
        });

        describe("should pass through for .eventually.equal(promise, 52, message) for rejected", function () {
            shouldFail({
                op: function () { return assert.eventually.equal(Promise.reject(), 52, message); },
                message: message
            });
        });
    });
});
