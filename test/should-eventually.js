"use strict";
require("./support/setup.js");
var shouldPass = require("./support/common.js").shouldPass;
var shouldFail = require("./support/common.js").shouldFail;

describe("Fulfillment value assertions:", function () {
    var promise = null;

    describe("Direct tests of fulfilled promises:", function () {
        describe("Basics:", function () {
            it(".eventually.equal(42)", function (done) {
                Promise.resolve(42).should.eventually.equal(42).notify(done);
            });
            it(".eventually.be.arguments", function (done) {
                Promise.resolve(arguments).should.eventually.be.arguments.notify(done);
            });
            it(".eventually.be.empty", function (done) {
                Promise.resolve([]).should.eventually.be.empty.notify(done);
            });
            it(".eventually.exist", function (done) {
                Promise.resolve(true).should.eventually.exist.notify(done);
            });
            it(".eventually.be.false", function (done) {
                Promise.resolve(false).should.eventually.be.false.notify(done);
            });
            it(".eventually.be.ok", function (done) {
                Promise.resolve({}).should.eventually.be.ok.notify(done);
            });
            it(".eventually.be.true", function (done) {
                Promise.resolve(true).should.eventually.be.true.notify(done);
            });
            it(".become(true)", function (done) {
                Promise.resolve(true).should.become(true).notify(done);
            });
        });

        describe("With flags and chainable methods involved:", function () {
            it(".not.eventually.be.ok", function (done) {
                Promise.resolve(false).should.not.eventually.be.ok.notify(done);
            });
            it(".eventually.not.be.ok", function (done) {
                Promise.resolve(false).should.eventually.not.be.ok.notify(done);
            });
            it(".eventually.deep.equal({ foo: 'bar' })", function (done) {
                Promise.resolve({ foo: "bar" }).should.eventually.deep.equal({ foo: "bar" }).notify(done);
            });
            it(".not.eventually.deep.equal({ foo: 'bar' })", function (done) {
                Promise.resolve({ foo: "baz" }).should.not.eventually.deep.equal({ foo: "bar" }).notify(done);
            });
            it(".eventually.not.deep.equal({ foo: 'bar' })", function (done) {
                Promise.resolve({ foo: "baz" }).should.eventually.not.deep.equal({ foo: "bar" }).notify(done);
            });
            it(".eventually.contain('foo')", function (done) {
                Promise.resolve(["foo", "bar"]).should.eventually.contain("foo").notify(done);
            });
            it(".not.eventually.contain('foo')", function (done) {
                Promise.resolve(["bar", "baz"]).should.not.eventually.contain("foo").notify(done);
            });
            it(".eventually.not.contain('foo')", function (done) {
                Promise.resolve(["bar", "baz"]).should.eventually.not.contain("foo").notify(done);
            });
            it(".eventually.contain.keys('foo')", function (done) {
                Promise.resolve({ foo: "bar", baz: "quux" }).should.eventually.contain.keys("foo").notify(done);
            });
            it(".not.eventually.contain.keys('foo')", function (done) {
                Promise.resolve({ baz: "quux" }).should.not.eventually.contain.keys("foo").notify(done);
            });
            it(".eventually.not.contain.keys('foo')", function (done) {
                Promise.resolve({ baz: "quux" }).should.eventually.not.contain.keys("foo").notify(done);
            });
            it(".eventually.be.an.instanceOf(Array)", function (done) {
                Promise.resolve([]).should.eventually.be.an.instanceOf(Array).notify(done);
            });

            if (Object.prototype.should.nested) {
                it(".eventually.have.nested.property('foo.bar')", function (done) {
                    Promise.resolve({ foo: { bar: "baz" } }).should.eventually.have.nested.property("foo.bar", "baz")
                        .notify(done);
                });
            }
        });
    });

    describe("Chaining:", function () {
        it(".eventually.be.ok.and.equal(42)", function (done) {
            Promise.resolve(42).should.eventually.be.ok.and.equal(42).notify(done);
        });
        it(".rejected.and.notify(done)", function (done) {
            Promise.reject().should.be.rejected.and.notify(done);
        });
        it(".fulfilled.and.notify(done)", function (done) {
            Promise.resolve().should.be.fulfilled.and.notify(done);
        });
    });

    describe("On a promise fulfilled with the number 42:", function () {
        beforeEach(function () {
            promise = Promise.resolve(42);
        });

        describe(".eventually.equal(42)", function () {
            shouldPass(function () { return promise.should.eventually.equal(42); });
        });
        describe(".eventually.eql(42)", function () {
            shouldPass(function () { return promise.should.eventually.eql(42); });
        });
        describe(".eventually.be.below(9000)", function () {
            shouldPass(function () { return promise.should.eventually.be.below(9000); });
        });
        describe(".eventually.be.a('number')", function () {
            shouldPass(function () { return promise.should.eventually.be.a("number"); });
        });

        describe(".eventually.be.an.instanceOf(String)", function () {
            shouldFail({
                op: function () { return promise.should.eventually.be.an.instanceOf(String); },
                message: "42 to be an instance of String"
            });
        });
        describe(".eventually.be.false", function () {
            shouldFail({
                op: function () { return promise.should.eventually.be.false; },
                message: "to be false"
            });
        });
        describe(".eventually.be.an('object')", function () {
            shouldFail({
                op: function () { return promise.should.eventually.be.an("object"); },
                message: "to be an object"
            });
        });

        describe(".eventually.not.equal(52)", function () {
            shouldPass(function () { return promise.should.eventually.not.equal(52); });
        });
        describe(".not.eventually.equal(52)", function () {
            shouldPass(function () { return promise.should.not.eventually.equal(52); });
        });

        describe(".eventually.not.equal(42)", function () {
            shouldFail({
                op: function () { return promise.should.eventually.not.equal(42); },
                message: "not equal 42"
            });
        });
        describe(".not.eventually.equal(42)", function () {
            shouldFail({
                op: function () { return promise.should.not.eventually.equal(42); },
                message: "not equal 42"
            });
        });

        describe(".become(42)", function () {
            shouldPass(function () { return promise.should.become(42); });
        });
        describe(".become(52)", function () {
            shouldFail({
                op: function () { return promise.should.become(52); },
                message: "deeply equal 52"
            });
        });

        describe(".not.become(42)", function () {
            shouldFail({
                op: function () { return promise.should.not.become(42); },
                message: "not deeply equal 42"
            });
        });
        describe(".not.become(52)", function () {
            shouldPass(function () { return promise.should.not.become(52); });
        });
    });

    describe("On a promise fulfilled with { foo: 'bar' }:", function () {
        beforeEach(function () {
            promise = Promise.resolve({ foo: "bar" });
        });

        describe(".eventually.equal({ foo: 'bar' })", function () {
            shouldFail({
                op: function () { return promise.should.eventually.equal({ foo: "bar" }); },
                message: "to equal { foo: 'bar' }"
            });
        });
        describe(".eventually.eql({ foo: 'bar' })", function () {
            shouldPass(function () { return promise.should.eventually.eql({ foo: "bar" }); });
        });
        describe(".eventually.deep.equal({ foo: 'bar' })", function () {
            shouldPass(function () { return promise.should.eventually.deep.equal({ foo: "bar" }); });
        });
        describe(".eventually.not.deep.equal({ foo: 'bar' })", function () {
            shouldFail({
                op: function () { return promise.should.eventually.not.deep.equal({ foo: "bar" }); },
                message: "not deeply equal { foo: 'bar' }"
            });
        });
        describe(".eventually.deep.equal({ baz: 'quux' })", function () {
            shouldFail({
                op: function () { return promise.should.eventually.deep.equal({ baz: "quux" }); },
                message: "deeply equal { baz: 'quux' }"
            });
        });
        describe(".eventually.not.deep.equal({ baz: 'quux' })", function () {
            shouldPass(function () { return promise.should.eventually.not.deep.equal({ baz: "quux" }); });
        });
        describe(".become({ foo: 'bar' })", function () {
            shouldPass(function () { return promise.should.become({ foo: "bar" }); });
        });
        describe(".not.become({ foo: 'bar' })", function () {
            shouldFail({
                op: function () { return promise.should.not.become({ foo: "bar" }); },
                message: "deeply equal { foo: 'bar' }"
            });
        });

        describe(".eventually.have.property('foo').that.equals('bar')", function () {
            shouldPass(function () { return promise.should.eventually.have.property("foo").that.equals("bar"); });
        });
    });
});
