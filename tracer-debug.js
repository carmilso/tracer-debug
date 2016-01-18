var util = require('util');

function TLogger(options) {
  var tracer = require('tracer').colorConsole(options);
  var env = process.env.NODE_ENV;
  var isDebug = typeof env != 'undefined' && env != options.env //'production';

  this.log = function() {
    if (isDebug) {
      var line = new Error().stack.match(/(at .*)/i)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.log(line);
    }
  };

  this.trace = function() {
    if (isDebug) {
      var line = new Error().stack.match(/(at .*)/i)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.trace(line);
    }
  };

  this.debug = function() {
    if (isDebug) {
      var line = new Error().stack.match(/(at .*)/i)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.debug(line);
    }
  };

  this.info = function() {
    if (isDebug) {
      var line = new Error().stack.match(/(at .*)/i)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.info(line);
    }
  };

  this.warn = function() {
    if (isDebug) {
      var line = new Error().stack.match(/(at .*)/i)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.warn(line);
    }
  };

  this.error = function() {
    if (isDebug) {
      var line = new Error().stack.match(/(at .*)/i)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.error(line);
    }
  };
};

/**
* @version 1.0.6
*/
module.exports = TLogger;
