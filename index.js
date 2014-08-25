"use strict";

var Test = require('./lib/test');
var mors = require('mors');

/**
 * Test against the given `app`,
 * returning a new `Test`.
 *
 * @param {Function|Server} app
 * @param {Number|Object} [port]
 * @param {Object} [opts]
 * @return {Test}
 * @api public
 */

module.exports = function(app, port, opts){
    if (typeof port === 'object') {
        opts = port;
        port = null;
    }
    if ('function' == typeof app) {
        app = new mors.Server(app, { port: port || 7910});
    }
    return new Test(app, opts || {});
};

/**
 * Expose `Test`
 */

module.exports.Test = Test;