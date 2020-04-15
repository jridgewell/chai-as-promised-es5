"use strict";
require("./support/setup.js");
var shouldPass = require("./support/common.js").shouldPass;
var shouldFail = require("./support/common.js").shouldFail;
var assert = require("chai").assert;

describe("Assert interface:", function () {
    var promise = null;
    var error = new Error("boo");
    var custom = "No. I am your father.";

    describe("when the promise is fulfilled", function () {
        beforeEach(function () {
            promise = Promise.resolve({ foo: "bar" });
        });

        describe(".isFulfilled(promise)", function () {
            shouldPass(function () { return assert.isFulfilled(promise); });
        });

        describe(".becomes(promise, correctValue)", function () {
            shouldPass(function () { return assert.becomes(promise, { foo: "bar" }); });
        });
        describe(".becomes(promise, incorrectValue)", function () {
            shouldFail({
                op: function () { return assert.becomes(promise, { baz: "quux" }); },
                message: "to deeply equal { baz: 'quux' }"
            });
        });

        describe(".becomes(promise, incorrectValue, custom)", function () {
            shouldFail({
                op: function () { return assert.becomes(promise, { baz: "quux" }, custom); },
                message: custom
            });
        });

        describe(".doesNotBecome(promise, correctValue)", function () {
            shouldFail({
                op: function () { return assert.doesNotBecome(promise, { foo: "bar" }); },
                message: "to not deeply equal { foo: 'bar' }"
            });
        });
        describe(".doesNotBecome(promise, incorrectValue)", function () {
            shouldPass(function () { return assert.doesNotBecome(promise, { baz: "quux" }); });
        });

        describe(".doesNotBecome(promise, correctValue, custom)", function () {
            shouldFail({
                op: function () { return assert.doesNotBecome(promise, { foo: "bar" }, custom); },
                message: custom
            });
        });

        describe(".isRejected(promise)", function () {
            shouldFail({
                op: function () { return assert.isRejected(promise); },
                message: "to be rejected"
            });
        });
        describe(".isRejected(promise, TypeError)", function () {
            shouldFail({
                op: function () { return assert.isRejected(promise, TypeError); },
                message: "to be rejected"
            });
        });
        describe(".isRejected(promise, /regexp/)", function () {
            shouldFail({
                op: function () { return assert.isRejected(promise, /regexp/); },
                message: "to be rejected"
            });
        });
        describe(".isRejected(promise, TypeError, /regexp/)", function () {
            shouldFail({
                op: function () { return assert.isRejected(promise, TypeError, /regexp/); },
                message: "to be rejected"
            });
        });
        describe(".isRejected(promise, errorInstance)", function () {
            shouldFail({
                op: function () { return assert.isRejected(promise, error); },
                message: "to be rejected"
            });
        });
        // Chai never interprets the 3rd parameter to assert.throws as
        // a custom error message. This is what we are checking here.
        describe(".isRejected(promise, /quux/, custom)", function () {
            shouldFail({
                op: function () { return assert.isRejected(promise, /quux/, custom); },
                notMessage: custom
            });
        });
    });


    describe("when the promise is rejected", function () {
        beforeEach(function () {
            promise = Promise.reject(error);
        });

        describe(".isFulfilled(promise)", function () {
            shouldFail({
                op: function () { return assert.isFulfilled(promise); },
                message: "to be fulfilled"
            });
        });

        describe(".isFulfilled(promise, custom)", function () {
            shouldFail({
                op: function () { return assert.isFulfilled(promise, custom); },
                message: custom
            });
        });

        describe(".isRejected(promise)", function () {
            shouldPass(function () { return assert.isRejected(promise); });
        });

        describe(".isRejected(promise, theError)", function () {
            shouldPass(function () { return assert.isRejected(promise, error); });
        });

        describe(".isRejected(promise, differentError)", function () {
            shouldFail({
                op: function () { return assert.isRejected(promise, new Error()); },
                message: "to be rejected with"
            });
        });

        // Chai never interprets the 3rd parameter to assert.throws as
        // a custom error message. This is what we are checking here.
        describe(".isRejected(promise, differentError, custom)", function () {
            shouldFail({
                op: function () { return assert.isRejected(promise, new Error(), custom); },
                notMessage: custom
            });
        });

        describe("with an Error having message 'foo bar'", function () {
            beforeEach(function () {
                promise = Promise.reject(new Error("foo bar"));
            });

            describe(".isRejected(promise, 'bar')", function () {
                shouldPass(function () { return assert.isRejected(promise, "bar"); });
            });

            describe(".isRejected(promise, 'bar', custom)", function () {
                shouldPass(function () { return assert.isRejected(promise, "bar", custom); });
            });

            describe(".isRejected(promise, /bar/)", function () {
                shouldPass(function () { return assert.isRejected(promise, /bar/); });
            });

            describe(".isRejected(promise, /bar/, custom)", function () {
                shouldPass(function () { return assert.isRejected(promise, /bar/, custom); });
            });

            describe(".isRejected(promise, 'quux')", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, "quux"); },
                    message: "to be rejected with"
                });
            });

            // Chai 3.5.0 never interprets the 3rd parameter to assert.throws as
            // a custom error message. This is what we are checking here.
            describe(".isRejected(promise, 'quux', custom)", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, "quux", custom); },
                    notMessage: custom
                });
            });

            describe(".isRejected(promise, /quux/)", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, /quux/); },
                    message: "to be rejected with"
                });
            });
        });

        describe("with a RangeError", function () {
            beforeEach(function () {
                promise = Promise.reject(new RangeError());
            });

            describe(".isRejected(promise, RangeError)", function () {
                shouldPass(function () { return assert.isRejected(promise, RangeError); });
            });

            describe(".isRejected(promise, TypeError)", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, TypeError); },
                    message: "to be rejected"
                });
            });
        });

        describe("with a RangeError having a message 'foo bar'", function () {
            beforeEach(function () {
                promise = Promise.reject(new RangeError("foo bar"));
            });

            describe(".isRejected(promise, RangeError, 'foo')", function () {
                shouldPass(function () { return assert.isRejected(promise, RangeError, "foo"); });
            });

            describe(".isRejected(promise, RangeError, /bar/)", function () {
                shouldPass(function () { return assert.isRejected(promise, RangeError, /bar/); });
            });

            describe(".isRejected(promise, RangeError, 'quux')", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, RangeError, "quux"); },
                    message: "to be rejected with an error including 'quux' but got 'foo bar'"
                });
            });

            describe(".isRejected(promise, RangeError, /quux/)", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, RangeError, /quux/); },
                    message: "to be rejected with an error matching /quux/ but got 'foo bar'"
                });
            });

            describe(".isRejected(promise, TypeError, 'foo')", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, TypeError, "foo"); },
                    message: "to be rejected with 'TypeError' but it was rejected with 'RangeError: foo bar'"
                });
            });
            describe(".isRejected(promise, TypeError, /bar/)", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, TypeError, /bar/); },
                    message: "to be rejected with 'TypeError' but it was rejected with 'RangeError: foo bar'"
                });
            });

            describe(".isRejected(promise, TypeError, 'quux')", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, TypeError, "quux"); },
                    message: "to be rejected with 'TypeError' but it was rejected with 'RangeError: foo bar'"
                });
            });
            describe(".isRejected(promise, TypeError, /quux/)", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, TypeError, /quux/); },
                    message: "to be rejected with 'TypeError' but it was rejected with 'RangeError: foo bar'"
                });
            });

            describe(".isRejected(promise, RangeError, 'foo', custom)", function () {
                shouldPass(function () { return assert.isRejected(promise, RangeError, "foo", custom); });
            });

            describe(".isRejected(promise, RangeError, /bar/, custom)", function () {
                shouldPass(function () { return assert.isRejected(promise, RangeError, /bar/, custom); });
            });

            describe(".isRejected(promise, RangeError, 'quux', custom)", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, RangeError, "quux", custom); },
                    message: custom
                });
            });

            describe(".isRejected(promise, RangeError, /quux/, custom)", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, RangeError, /quux/, custom); },
                    message: custom
                });
            });

            describe(".isRejected(promise, RangeError, undefined, custom)", function () {
                shouldPass(function () { return assert.isRejected(promise, RangeError, undefined, custom); });
            });

            describe(".isRejected(promise, TypeError, undefined, custom)", function () {
                shouldFail({
                    op: function () { return assert.isRejected(promise, TypeError, undefined, custom); },
                    message: custom
                });
            });
        });
    });
});
