"use strict";

var Test = require('./lib/test');
var mors = require('mors');

/**
 * Test against the given `app`,
 * returning a new `Test`.
 *
 * @param {Function|Server} app
 * @param {Object} [opts]
 * @return {Test}
 * @api public
 */

module.exports = function(app, opts){
    if ('function' == typeof app) {
        opts = opts || {};
        opts.port = opts.port || 7911;
        app = new mors.Server(app, opts);
    }
    return new Test(app);
};

/**
 * Expose `Test`
 */

module.exports.Test = Test;