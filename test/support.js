"use strict";

var chai = require('chai');

exports.t = chai.assert;

exports.donner =  function donner(n, func) {
    if (n < 1) {
        return func();
    }
    return function(err) {
        if (--n < 1) {
            func(err ? err : null);
        }
    };
};