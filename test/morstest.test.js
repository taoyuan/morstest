"use strict";

var mors = require('mors');
var request = require('../');

var s = require('./support');
var t = s.t;

describe('request(app)', function() {
    it('should fire up the app on an ephemeral port', function (done) {
        var app = mors();

        app.route('/*', function (req) {
            t.equal(req.topic, '/foo');
            t.equal(req.payload, 'hey');
            done();
        });

        request(app)
            .topic('/foo')
            .payload('hey')
            .publish();
    });
});