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
            clireq.close(done);
        });

        clireq = request(app)
            .topic('/foo')
            .payload('hey')
            .publish();
    });

    it('should publish with a message', function (done) {
        var app = mors();
        var clireq;

        app.route('/*', function (req) {
            t.equal(req.topic, '/foo');
            t.equal(req.payload, 'hey');
            clireq.close(done);
        });

        clireq = request(app)
            .topic('/foo')
            .publish('hey');
    });

    it('should work with an active server', function (done) {
        var app = mors();
        var clireq;

        app.route('/*', function (req) {
            t.equal(req.topic, '/foo');
            t.equal(req.payload, 'hey');
            clireq.close(function () {
                server.close(done);
            });
        });

        var server = app.listen(7911, function () {
            clireq = request(server)
                .topic('/foo')
                .payload('hey')
                .publish();
        });
    });

});