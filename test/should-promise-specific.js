"use strict";
require("./support/setup.js");
var shouldPass = require("./support/common.js").shouldPass;
var shouldFail = require("./support/common.js").shouldFail;
var expect = require("chai").expect;

describe("Promise-specific extensions:", function () {
    var promise = null;
    var error = new Error("boo");
    error.myProp = ["myProp value"];
    var custom = "No. I am your father.";

    function assertingDoneFactory(done) {
        return function (result) {
            try {
                expect(result).to.equal(error);
            } catch (assertionError) {
                done(assertionError);
            }

            done();
        };
    }

    describe("when the promise is fulfilled", function () {
        beforeEach(function () {
            promise = Promise.resolve(42);
        });

        describe(".fulfilled", function () {
            shouldPass(function () { return promise.should.be.fulfilled; });
        });

        describe(".fulfilled passes the fulfilled value", function () {
            shouldPass(function () {
                return promise.should.be.fulfilled.then(function (passedValue) {
                    passedValue.should.equal(42);
                });
            });
        });

        describe(".fulfilled allows chaining", function () {
            shouldPass(function () { return promise.should.be.fulfilled.and.eventually.equal(42); });
        });

        describe(".not.fulfilled", function () {
            shouldFail({
                op: function () { return promise.should.not.be.fulfilled; },
                message: "not to be fulfilled but it was fulfilled with 42"
            });
        });

        describe(".rejected", function () {
            shouldFail({
                op: function () { return promise.should.be.rejected; },
                message: "to be rejected but it was fulfilled with 42"
            });
        });

        describe(".not.rejected passes the fulfilled value", function () {
            shouldPass(function () {
                return promise.should.not.be.rejected.then(function (passedValue) {
                    passedValue.should.equal(42);
                });
            });
        });

        // .not inverts all following assertions so the following test is
        // equivalent to promise.should.eventually.not.equal(31)
        describe(".not.rejected allows chaining", function () {
            shouldPass(function () { return promise.should.not.be.rejected.and.eventually.equal(31); });
        });

        describe(".rejectedWith(TypeError)", function () {
            shouldFail({
                op: function () { return promise.should.be.rejectedWith(TypeError); },
                message: "to be rejected with 'TypeError' but it was fulfilled with 42"
            });
        });
        describe(".not.rejectedWith(TypeError) passes the fulfilled value", function () {
            shouldPass(function () {
                return promise.should.not.be.rejectedWith(TypeError).then(function (passedValue) {
                    passedValue.should.equal(42);
                });
            });
        });

        describe(".not.rejectedWith(TypeError) allows chaining", function () {
            shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError).and.eventually.equal(31); });
        });

        describe(".rejectedWith('message substring')", function () {
            shouldFail({
                op: function () { return promise.should.be.rejectedWith("message substring"); },
                message: "to be rejected with an error including 'message substring' but it was fulfilled with " +
                         "42"
            });
        });
        describe(".rejectedWith(/regexp/)", function () {
            shouldFail({
                op: function () { return promise.should.be.rejectedWith(/regexp/); },
                message: "to be rejected with an error matching /regexp/ but it was fulfilled with 42"
            });
        });
        describe(".rejectedWith(TypeError, 'message substring')", function () {
            shouldFail({
                op: function () { return promise.should.be.rejectedWith(TypeError, "message substring"); },
                message: "to be rejected with 'TypeError' but it was fulfilled with 42"
            });
        });
        describe(".rejectedWith(TypeError, /regexp/)", function () {
            shouldFail({
                op: function () { return promise.should.be.rejectedWith(TypeError, /regexp/); },
                message: "to be rejected with 'TypeError' but it was fulfilled with 42"
            });
        });
        describe(".rejectedWith(errorInstance)", function () {
            shouldFail({
                op: function () { return promise.should.be.rejectedWith(error); },
                message: "to be rejected with 'Error: boo' but it was fulfilled with 42"
            });
        });

        describe(".not.rejected", function () {
            shouldPass(function () { return promise.should.not.be.rejected; });
        });
        describe(".not.rejectedWith(TypeError)", function () {
            shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError); });
        });
        describe(".not.rejectedWith('message substring')", function () {
            shouldPass(function () { return promise.should.not.be.rejectedWith("message substring"); });
        });
        describe(".not.rejectedWith(/regexp/)", function () {
            shouldPass(function () { return promise.should.not.be.rejectedWith(/regexp/); });
        });
        describe(".not.rejectedWith(TypeError, 'message substring')", function () {
            shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError, "message substring"); });
        });
        describe(".not.rejectedWith(TypeError, /regexp/)", function () {
            shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError, /regexp/); });
        });
        describe(".not.rejectedWith(errorInstance)", function () {
            shouldPass(function () { return promise.should.not.be.rejectedWith(error); });
        });

        describe(".should.notify(done)", function () {
            it("should pass the test", function (done) {
                promise.should.notify(done);
            });
        });
    });

    describe("when the promise is rejected", function () {
        beforeEach(function () {
            promise = Promise.reject(error);
        });

        describe(".fulfilled", function () {
            shouldFail({
                op: function () { return promise.should.be.fulfilled; },
                message: "to be fulfilled but it was rejected with 'Error: boo'"
            });
        });

        describe(".not.fulfilled", function () {
            shouldPass(function () { return promise.should.not.be.fulfilled; });
        });

        describe(".not.fulfilled should allow chaining", function () {
            shouldPass(function () {
                return promise.should.not.be.fulfilled.and.eventually.have.property("nonexistent");
            });
        });

        describe(".not.fulfilled should pass the rejection reason", function () {
            shouldPass(function () {
                return promise.should.not.be.fulfilled.then(function (passedError) {
                    passedError.should.equal(error);
                });
            });
        });

        describe(".rejected", function () {
            shouldPass(function () { return promise.should.be.rejected; });
        });

        describe(".not.rejected", function () {
            shouldFail({
                op: function () { return promise.should.not.be.rejected; },
                message: "not to be rejected but it was rejected with 'Error: boo'"
            });
        });
        describe(".rejected should allow chaining", function () {
            shouldPass(function () { return promise.should.be.rejected.and.eventually.have.property("myProp"); });
        });

        describe(".rejected passes the rejection reason", function () {
            shouldPass(function () {
                return promise.should.be.rejected.then(function (passedError) {
                    passedError.should.equal(error);
                });
            });
        });

        describe(".rejectedWith(theError)", function () {
            shouldPass(function () { return promise.should.be.rejectedWith(error); });
        });

        describe(".not.rejectedWith(theError)", function () {
            shouldFail({
                op: function () { return promise.should.not.be.rejectedWith(error); },
                message: "not to be rejected with 'Error: boo'"
            });
        });

        describe(".rejectedWith(theError) should allow chaining", function () {
            shouldPass(function () {
                return promise.should.be.rejectedWith(error).and.eventually.have.property("myProp");
            });
        });

        describe(".rejectedWith(theError) passes the rejection reason", function () {
            shouldPass(function () {
                return promise.should.be.rejectedWith(error).then(function (passedError) {
                    passedError.should.equal(error);
                });
            });
        });

        describe(".rejectedWith(differentError)", function () {
            shouldFail({
                op: function () { return promise.should.be.rejectedWith(new Error()); },
                message: "to be rejected with 'Error' but it was rejected with 'Error: boo'"
            });
        });

        describe(".not.rejectedWith(differentError)", function () {
            shouldPass(function () { return promise.should.not.be.rejectedWith(new Error()); });
        });

        // Chai 3.5.0 never interprets the 2nd paramter to
        // expect(fn).to.throw(a, b) as a custom error message. This is
        // what we are testing here.
        describe(".rejectedWith(differentError, custom)", function () {
            shouldFail({
                op: function () { return promise.should.be.rejectedWith(new Error(), custom); },
                message: "to be rejected with 'Error' but it was rejected with 'Error: boo'",
                notMessage: custom
            });
        });

        describe(".not.rejectedWith(differentError, custom)", function () {
            shouldPass(function () { return promise.should.not.be.rejectedWith(new Error(), custom); });
        });

        describe("with an Error having message 'foo bar'", function () {
            beforeEach(function () {
                promise = Promise.reject(new Error("foo bar"));
            });

            describe(".rejectedWith('foo')", function () {
                shouldPass(function () { return promise.should.be.rejectedWith("foo"); });
            });

            describe(".not.rejectedWith('foo')", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith("foo"); },
                    message: "not to be rejected with an error including 'foo'"
                });
            });

            describe(".rejectedWith(/bar/)", function () {
                shouldPass(function () { return promise.should.be.rejectedWith(/bar/); });
            });

            describe(".not.rejectedWith(/bar/)", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(/bar/); },
                    message: "not to be rejected with an error matching /bar/"
                });
            });

            describe(".rejectedWith('quux')", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith("quux"); },
                    message: "to be rejected with an error including 'quux' but got 'foo bar'"
                });
            });

            describe(".not.rejectedWith('quux')", function () {
                shouldPass(function () { return promise.should.be.not.rejectedWith("quux"); });
            });

            describe(".rejectedWith(/quux/)", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(/quux/); },
                    message: "to be rejected with an error matching /quux/ but got 'foo bar'"
                });
            });

            describe(".not.rejectedWith(/quux/)", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(/quux/); });
            });

            // Chai 3.5.0 never interprets the 2nd paramter to
            // expect(fn).to.throw(a, b) as a custom error
            // message. This is what we are testing here.
            describe(".rejectedWith('foo', custom)", function () {
                shouldPass(function () { return promise.should.be.rejectedWith("foo", custom); });
            });

            describe(".not.rejectedWith('foo', custom)", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith("foo", custom); },
                    message: "not to be rejected with an error including 'foo'",
                    notMessage: custom
                });
            });

            describe(".rejectedWith(/bar/, custom)", function () {
                shouldPass(function () { return promise.should.be.rejectedWith(/bar/, custom); });
            });

            describe(".not.rejectedWith(/bar/, custom)", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(/bar/); },
                    message: "not to be rejected with an error matching /bar/",
                    notMessage: custom
                });
            });
        });

        describe("with a RangeError", function () {
            beforeEach(function () {
                promise = Promise.reject(new RangeError());
            });

            describe(".rejectedWith(RangeError)", function () {
                shouldPass(function () { return promise.should.be.rejectedWith(RangeError); });
            });

            describe(".not.rejectedWith(RangeError)", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(RangeError); },
                    message: "not to be rejected with 'RangeError' but it was rejected with 'RangeError'"
                });
            });

            describe(".rejectedWith(TypeError)", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(TypeError); },
                    message: "to be rejected with 'TypeError' but it was rejected with 'RangeError'"
                });
            });

            // Case for issue #64.
            describe(".rejectedWith(Array)", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(Array); },
                    message: "to be rejected with 'Array' but it was rejected with 'RangeError'"
                });
            });

            describe(".not.rejectedWith(TypeError)", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError); });
            });
        });

        describe("with a RangeError having a message 'foo bar'", function () {
            beforeEach(function () {
                promise = Promise.reject(new RangeError("foo bar"));
            });

            describe(".rejectedWith(RangeError, 'foo')", function () {
                shouldPass(function () { return promise.should.be.rejectedWith(RangeError, "foo"); });
            });

            describe(".not.rejectedWith(RangeError, 'foo')", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(RangeError, "foo"); },
                    message: "not to be rejected with 'RangeError' but it was rejected with 'RangeError: foo bar'"
                });
            });

            describe(".rejectedWith(RangeError, /bar/)", function () {
                shouldPass(function () { return promise.should.be.rejectedWith(RangeError, /bar/); });
            });

            describe(".not.rejectedWith(RangeError, /bar/)", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(RangeError, /bar/); },
                    message: "not to be rejected with 'RangeError' but it was rejected with 'RangeError: foo bar'"
                });
            });

            describe(".rejectedWith(RangeError, 'quux')", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(RangeError, "quux"); },
                    message: "to be rejected with an error including 'quux' but got 'foo bar'"
                });
            });
            describe(".rejectedWith(RangeError, /quux/)", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(RangeError, /quux/); },
                    message: "to be rejected with an error matching /quux/ but got 'foo bar'"
                });
            });

            describe(".rejectedWith(TypeError, 'foo')", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(TypeError, "foo"); },
                    message: "to be rejected with 'TypeError' but it was rejected with 'RangeError: foo bar'"
                });
            });
            describe(".rejectedWith(TypeError, /bar/)", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(TypeError, /bar/); },
                    message: "to be rejected with 'TypeError' but it was rejected with 'RangeError: foo bar'"
                });
            });

            describe(".rejectedWith(TypeError, 'quux')", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(TypeError, "quux"); },
                    message: "to be rejected with 'TypeError' but it was rejected with 'RangeError: foo bar'"
                });
            });
            describe(".rejectedWith(TypeError, /quux/)", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(TypeError, /quux/); },
                    message: "to be rejected with 'TypeError' but it was rejected with 'RangeError: foo bar'"
                });
            });

            describe(".not.rejectedWith(RangeError, 'foo')", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(RangeError, "foo"); },
                    message: "not to be rejected with 'RangeError' but it was rejected with 'RangeError: foo bar'"
                });
            });
            describe(".not.rejectedWith(RangeError, /bar/)", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(RangeError, /bar/); },
                    message: "not to be rejected with 'RangeError' but it was rejected with 'RangeError: foo bar'"
                });
            });

            describe(".not.rejectedWith(RangeError, 'quux')", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(RangeError, "quux"); });
            });
            describe(".not.rejectedWith(RangeError, /quux/)", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(RangeError, /quux/); });
            });
            describe(".not.rejectedWith(TypeError, 'foo')", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError, "foo"); });
            });
            describe(".not.rejectedWith(TypeError, /bar/)", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError, /bar/); });
            });
            describe(".not.rejectedWith(TypeError, 'quux')", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError, "quux"); });
            });
            describe(".not.rejectedWith(TypeError, /quux/)", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError, /quux/); });
            });
            describe(".rejectedWith(RangeError, 'foo', custom)", function () {
                shouldPass(function () { return promise.should.be.rejectedWith(RangeError, "foo", custom); });
            });

            describe(".not.rejectedWith(RangeError, 'foo', custom)", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(RangeError, "foo", custom); },
                    message: custom
                });
            });

            describe(".rejectedWith(RangeError, /bar/, custom)", function () {
                shouldPass(function () { return promise.should.be.rejectedWith(RangeError, /bar/, custom); });
            });

            describe(".not.rejectedWith(RangeError, /bar/, custom)", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(RangeError, /bar/, custom); },
                    message: custom
                });
            });

            describe(".rejectedWith(RangeError, 'quux', custom)", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(RangeError, "quux", custom); },
                    message: custom
                });
            });

            describe(".not.rejectedWith(TypeError, 'quux', custom)", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError, "quux", custom); });
            });

            describe(".rejectedWith(RangeError, /quux/, custom)", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(RangeError, /quux/, custom); },
                    message: custom
                });
            });

            describe(".not.rejectedWith(TypeError, /quux/, custom)", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError, /quux/, custom); });
            });

            describe(".rejectedWith(RangeError, undefined, custom)", function () {
                shouldPass(function () { return promise.should.be.rejectedWith(RangeError, undefined, custom); });
            });

            describe(".not.rejectedWith(RangeError, undefined, custom)", function () {
                shouldFail({
                    op: function () { return promise.should.not.be.rejectedWith(RangeError, undefined, custom); },
                    message: custom
                });
            });

            describe(".rejectedWith(TypeError, undefined, custom)", function () {
                shouldFail({
                    op: function () { return promise.should.be.rejectedWith(TypeError, undefined, custom); },
                    message: custom
                });
            });

            describe(".not.rejectedWith(TypeError, undefined, custom)", function () {
                shouldPass(function () { return promise.should.not.be.rejectedWith(TypeError, undefined, custom); });
            });
        });

        describe(".should.notify(done)", function () {
            it("should fail the test with the original error", function (done) {
                promise.should.notify(assertingDoneFactory(done));
            });
        });
    });

    describe(".should.notify with chaining (GH-3)", function () {
        describe("the original promise is fulfilled", function () {
            beforeEach(function () {
                promise = Promise.resolve();
            });

            describe("and the follow-up promise is fulfilled", function () {
                beforeEach(function () {
                    promise = promise.then(function () { /* Do nothing */ });
                });

                it("should pass the test", function (done) {
                    promise.should.notify(done);
                });
            });

            describe("but the follow-up promise is rejected", function () {
                beforeEach(function () {
                    promise = promise.then(function () {
                        throw error;
                    });
                });

                it("should fail the test with the error from the follow-up promise", function (done) {
                    promise.should.notify(assertingDoneFactory(done));
                });
            });
        });

        describe("the original promise is rejected", function () {
            beforeEach(function () {
                promise = Promise.reject(error);
            });

            describe("but the follow-up promise is fulfilled", function () {
                beforeEach(function () {
                    promise = promise.then(function () { /* Do nothing */ });
                });

                it("should fail the test with the error from the original promise", function (done) {
                    promise.should.notify(assertingDoneFactory(done));
                });
            });

            describe("and the follow-up promise is rejected", function () {
                beforeEach(function () {
                    promise = promise.then(function () {
                        throw new Error("follow up");
                    });
                });

                it("should fail the test with the error from the original promise", function (done) {
                    promise.should.notify(assertingDoneFactory(done));
                });
            });
        });
    });

    describe("Using with non-thenables", function () {
        describe("A number", function () {
            var number = 5;

            it("should fail for .fulfilled", function () {
                expect(function () { return number.should.be.fulfilled; }).to.throw(TypeError, "not a thenable");
            });
            it("should fail for .rejected", function () {
                expect(function () { return number.should.be.rejected; }).to.throw(TypeError, "not a thenable");
            });
            it("should fail for .become", function () {
                expect(function () { return number.should.become(5); }).to.throw(TypeError, "not a thenable");
            });
            it("should fail for .eventually", function () {
                expect(function () { return number.should.eventually.equal(5); }).to.throw(TypeError, "not a thenable");
            });
            it("should fail for .notify", function () {
                expect(function () { return number.should.notify(function () { /* Doesn't matter */ }); })
                    .to.throw(TypeError, "not a thenable");
            });
        });
    });

    describe("Using together with other Chai as Promised asserters", function () {
        describe(".fulfilled.and.eventually.equal(42)", function () {
            shouldPass(function () { return Promise.resolve(42).should.be.fulfilled.and.eventually.equal(42); });
        });
        describe(".fulfilled.and.rejected", function () {
            shouldFail({
                op: function () { return Promise.resolve(42).should.be.fulfilled.and.rejected; },
                message: "to be rejected but it was fulfilled with 42"
            });
        });

        describe(".rejected.and.eventually.equal(42)", function () {
            shouldPass(function () { return Promise.reject(42).should.be.rejected.and.eventually.equal(42); });
        });
        describe(".rejected.and.become(42)", function () {
            shouldPass(function () { return Promise.reject(42).should.be.rejected.and.become(42); });
        });
    });

    describe("With promises that only become rejected later (GH-24)", function () {
        it("should wait for them", function (done) {
            var reject;
            var rejectedLaterPromise = new Promise(function (_, r) {
                reject = r;
            });
            rejectedLaterPromise.should.be.rejectedWith("error message").and.notify(done);

            setTimeout(function () { return reject(new Error("error message")); }, 100);
        });
    });

    describe("`rejectedWith` with non-`Error` rejection reasons (GH-33)", function () {
        shouldPass(function () { return Promise.reject(42).should.be.rejectedWith(42); });
    });
});
