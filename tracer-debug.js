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
      tracer.log("%j %s \n", args, line);
    }
  };

  this.trace = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.trace("%j %s \n", args, line);
    }
  };

  this.debug = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.debug("%j %s \n", args, line);
    }
  };

  this.info = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.info("%j %s \n", args, line);
    }
  };

  this.warn = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.warn("%j %s \n", args, line);
    }
  };

  this.error = function() {
    if (isDebug) {
      var line = new Error().stack.match(re)[0];
      var args = Array.prototype.slice.call(arguments);
      tracer.error("%j %s \n", args, line);
    }
  };
};

/**
* @version 1.1.2
*/
module.exports = TLogger;
