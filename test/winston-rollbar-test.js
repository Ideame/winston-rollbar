/*
 * winston-rollbar-test.js: Tests for instances of the Rollbar transport
 *
 * (C) 2011 Juan Pablo Garcia Dalolla
 * MIT LICENSE
 */
var vows = require('vows');
var assert = require('assert');
var winston = require('winston');
var helpers = require('winston/test/helpers');
var Rollbar = require('../lib/winston-rollbar').Rollbar;

function assertRollbar (transport) {
    assert.instanceOf(transport, Rollbar);
    assert.isFunction(transport.log);
}

var transport = new (Rollbar)({ rollbarAccessToken: '8802be7c990a4922beadaaefb6e0327b' });

vows.describe('winston-rollbar').addBatch({
    "An instance of the Rollbar Transport": {
        "should have the proper methods defined": function () {
            assertRollbar(transport);
        },
        "the log() method": helpers.testNpmLevels(transport, "should log messages to Rollbar", function (ign, err, logged) {
            if (err) throw err;
            assert.isTrue(!err);
            assert.isTrue(logged);
        })
    }
}).export(module);
