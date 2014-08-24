"use strict";

exports.Builder = PacketBuilder;

function PacketBuilder() {
    this._packet = {};
}

PacketBuilder.prototype.packet = function (packet) {
    this._packet = packet;
    return this;
};

PacketBuilder.prototype.topic = function (topic) {
    this._packet.topic = topic;
    return this;
};

PacketBuilder.prototype.payload = function (payload) {
    this._packet.payload = payload;
    return this;
};

PacketBuilder.prototype.qos = function (qos) {
    this._packet.qos = qos;
    return this;
};

PacketBuilder.prototype.retain = function (retain) {
    this._packet.retain = retain;
    return this;
};