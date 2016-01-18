var util = require('util');

function TLogger(options) {
  var tracer = require('tracer').colorConsole(options);
  var env = process.env.NODE_ENV;
  var re = new RegExp("at " + module.parent.filename + ":" + ".*");
  var isDebug = typeof env != 'undefined' && env != options.env //'production';

  this.log = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.log(args, line);
    }
  };

  this.trace = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.trace(args, line);
    }
  };

  this.debug = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.debug(args, line);
    }
  };

  this.info = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.info(args, line);
    }
  };

  this.warn = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.warn(args, line);
    }
  };

  this.error = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.error(args, line);
    }
  };
};

/**
* @version 1.1.1
*/
module.exports = TLogger;
