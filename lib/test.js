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
        this.__server = this.server = app.listen(7911);
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

Test.prototype.publish = function (message, cb) {
    if (typeof message === 'function') {
        cb = message;
        message = null;
    }
    if (message) this.payload(message);
    this._client(function (client) {
        client.publish(this._topic, this._payload, {
            qos: this._qos,
            retain: this._retain
        }, cb);
    });
    return this;
};

Test.prototype._client = function (cb) {
    cb = cb || function () {};
    if (this.__client) return cb(this.__client);

    var self = this;
    this.server.ready(function () {
        if (self.ended) return cb();

        self.__client = mqtt.createClient(self.port, self.opts);
        cb.call(self, self.__client);
    });
};

Test.prototype.destroy =
Test.prototype.close = function (cb) {
    if (this.ended) return cb && cb();
    this.ended = true;
    var self = this;
    async.series([
        function (callback) {
            if (self.__client) self.__client.end();
            callback();
        },
        function (callback) {
            if (self.__server) return self.__server.close(callback);
            callback();
        }
    ], cb);
};