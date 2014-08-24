"use strict";

var mqtt = require('mqtt');
var async = require('async');

exports = module.exports = Test;

/**
 *
 * @param app
 * @param opts connect options
 * @returns {Test}
 * @constructor
 */
function Test(app, opts) {
    if (!(this instanceof Test)) return new Test(app, opts);

    this.app = app;
    this.server = typeof app === 'function' ? app.listen(7911) : app;

    this.opts = opts = opts || {};
    this.port = opts.port || this.server.opts.port;

    this.stack = [];
}

Test.prototype.publish = function (topic, message, opts) {
    this.stack.push(function (client, callback) {
        client.publish(topic, message, opts, callback);
    });
    return this;
};

Test.prototype.end = function (cb) {
    var self = this;
    var server = this.server;
    var client;
    server.ready(function () {
        client = mqtt.createClient(self.port, self.opts);
        client.on('connect', function () {
            async.eachSeries(self.stack, function (fn, callback) {
                fn(client, callback);
            }, function (err) {
                // let request fly a moment
                setTimeout(end(err), 100);
            });
        });
    });

    function end(err) {
        return function () {
            server.close(function () {
                cb && cb(err);
            });
            client.end();
        }
    }
};
