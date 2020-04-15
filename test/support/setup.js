"use strict";
var chai = require("chai");
var chaiAsPromised = require("../..");

chai.should();
chai.use(chaiAsPromised);

process.on("unhandledRejection", function () {
    // Do nothing; we test these all the time.
});
process.on("rejectionHandled", function () {
    // Do nothing; we test these all the time.
});
