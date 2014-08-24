"use strict";

var mors = require('mors');
var util = require('util');

var Request = require('./request');
var Client = require('./client');

exports = module.exports = function (app) {
    return new Test(app);
};

function Test(app) {
    if (!(this instanceof Test)) return new Test(app);
    Request.call(this);

    this.app = app;
    this.client = new Client();
}

util.inherits(Test, Request);

Test.prototype.publish = function (packet, cb) {
    if (typeof packet === 'function') {
        cb = packet;
        packet = null;
    }
    packet = packet || this._packet;

    var app = this.app;
    var client = this.client;

    var handle = typeof app === 'function' ? app : app.handle.bind(app);
    handle(mors.Request(client, packet), mors.Response(client), cb);
};


