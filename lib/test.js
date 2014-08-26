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

    this.server = app;
    if (typeof app === 'function') {
        this._server = this.server = app.listen(7911);
    }

    this.opts = opts = opts || {};
    this.port = opts.port || this.server.opts.port;

    this._qos = 0;
    this._retain = false;
}

Test.prototype.topic = function (topic) {
    this._topic = topic;
    return this;
};

Test.prototype.payload = function (payload) {
    this._payload = payload;
    return this;
};

Test.prototype.qos = function (qos) {
    this._qos = qos;
    return this;
};

Test.prototype.retain = function (retain) {
    this._retain= retain;
    return this;
};

Test.prototype.publish = function (cb) {
    this.client(function (client) {
        client.publish(this._topic, this._payload, {
            qos: this._qos,
            retain: this._retain
        }, cb);
    });
    return this;
};

Test.prototype.client = function (cb) {
    cb = cb || function () {};
    if (this._client) return cb(this._client);

    var self = this;
    this.server.ready(function () {
        if (self.ended) return cb();

        self._client = mqtt.createClient(self.port, self.opts);
        cb.call(self, self._client);
    });
};

Test.prototype.end = function (cb) {
    if (this.ended) return cb && cb();
    this.ended = true;
    var self = this;
    async.series([
        function (callback) {
            if (self._client) self._client.end();
            callback();
        },
        function (callback) {
            if (self._server) return self._server.close(callback);
            callback();
        }
    ], cb);
};