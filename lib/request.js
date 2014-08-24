"use strict";

var util = require('util');
var PacketBuilder = require('./packet').Builder;

module.exports = Request;

/**
 * Request
 *
 * @constructor
 */

function Request() {
    PacketBuilder.call(this);
}

util.inherits(Request, PacketBuilder);