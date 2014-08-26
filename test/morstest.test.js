"use strict";

var mors = require('mors');
var request = require('../');

var s = require('./support');
var t = s.t;

describe('request(app)', function () {
    it('should fire up the app on an ephemeral port', function (done) {
        var app = mors();
        var clireq;

        app.route('/*', function (req) {
            t.equal(req.topic, '/foo');
            t.equal(req.payload, 'hey');
            clireq.end(done);
        });

        clireq = request(app)
            .topic('/foo')
            .payload('hey')
            .publish();
    });

    it('should work with an active server', function (done) {
        var app = mors();
        var clireq;

        app.route('/*', function (req) {
            t.equal(req.topic, '/foo');
            t.equal(req.payload, 'hey');
            clireq.end(done);
        });

        var server = app.listen(7911, function () {
            clireq = request(server)
                .topic('/foo')
                .payload('hey')
                .publish();
        });
    });
});