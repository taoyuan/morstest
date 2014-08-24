"use strict";

var mors = require('mors');
var request = require('../');

var s = require('./support');
var t = s.t;

describe('request(app)', function () {
    it('should fire up the app on an ephemeral port', function (done) {
        var d = s.donner(2, done);
        var app = mors();

        app.route('/*', function (req) {
            t.equal(req.topic, '/foo');
            t.equal(req.payload, 'hey');
            d();
        });

        request(app)
            .publish('/foo', 'hey')
            .end(d);
    });

    it('should work with an active server', function (done) {
        var d = s.donner(2, done);
        var app = mors();

        app.route('/*', function (req) {
            t.equal(req.topic, '/foo');
            t.equal(req.payload, 'hey');
            d();
        });

        var server = app.listen(7911, function () {
            request(server)
                .publish('/foo', 'hey')
                .end(d);
        });
    });
});