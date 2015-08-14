/*
* winston-rollbar.js: Transport for outputting logs to Rollbar service
*
* (C) 2010 Juan Pablo Garcia Dalolla
* MIT LICENCE
*/

var util = require('util')
    , rollbar = require('rollbar')
    , winston = require('winston');

/**
* @constructs Rollbar
* @param {object} options hash of options
*/

var Rollbar = exports.Rollbar = function (options) {
    options = options || {};

    if (!options.rollbarAccessToken) {
        throw "winston-rollbar requires a 'rollbarAccessToken' property ";
    }

    if (options.rollbarAccessToken && options.rollbarConfig) {
        rollbar.init(options.rollbarAccessToken, options.rollbarConfig);
    } else if (options.rollbarAccessToken) {
        rollbar.init(options.rollbarAccessToken);
    }

    this.name                 = 'rollbar';
    this.level                = options.level || 'warn';
    this.metadataAsRequest    = options.metadataAsRequest || false;
    this.silent               = options.silent || false;
    this.rollbar              = rollbar;
    this.handleExceptions     = options.handleExceptions || false;
};

/** @extends winston.Transport */
util.inherits(Rollbar, winston.Transport);

/**
* Define a getter so that `winston.transports.Rollbar`
* is available and thus backwards compatible.
*/
winston.transports.Rollbar = Rollbar;

/**
* Core logging method exposed to Winston. Metadata is optional.
* @function log
* @member Rollbar
* @param level {string} Level at which to log the message
* @param msg {string} Message to log
* @param meta {Object} **Optional** Additional metadata to attach
* @param callback {function} Continuation to respond to when complete.
*/
Rollbar.prototype.log = function (level, msg, meta, callback) {
    var self = this;

    if (this.silent) { return callback(null, true); }

    var req = null;

    if (this.metadataAsRequest) {
        if (req && req.socket) { req = meta; }
    } else if (meta && meta.req) {
        if (typeof meta.req === 'function') {
          req = meta.req();
        } else {
          req = meta.req;
        }
    }

    if (['warn','error'].indexOf(level) > -1 && (msg instanceof Error || meta instanceof Error)) {
        var error;
        if (msg instanceof Error) {
            error = msg;
            meta.level = meta.level || level;
        } else {
            error = meta;
            meta = { level: level };
        }

        rollbar.handleErrorWithPayloadData(error, meta, req, function (err) {
            if (err) { return callback(err); }

            self.emit('logged');
            callback(null, true);
        });
    } else {
        rollbar.reportMessage(msg, level, req, function (err) {
            if (err) { return callback(err); }

            self.emit('logged');
            callback(null, true);
        });
    }
};
