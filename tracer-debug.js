/**
* Constructor.
* @param options Configuration options. See https://www.npmjs.com/package/tracer for all the possibilities.
* @param options.stackTrace {Boolean|Number} Display stack trace (default: false). Accepts different levels of verbosity; e.g. if stackTrace is 1 it will display the first line of the stack, if stackTrace is 2 it will display the 2 first lines of the stack, and so on.
*/
function TracerDebug(options) {
  // Set default options, if not provided.
  var extend = require('extend');
  extend(options, {
    format: "{{timestamp}} {{message}}",
    dateformat: "HH:MM:ss.L",
    stackTrace: false
  });

  var tracer = require('tracer').colorConsole(options);
  var util   = require('util');
  // Display log messages as long as your program doesn't run in production.
  var isDebug = process.env.NODE_ENV !== undefined &&
                process.env.NODE_ENV !== 'production';

  // Private generic output function.
  function output(fn, args) {
    if (isDebug) {
      // Cast arguments to their native type, for pretty ouput.
      var _args = Array.prototype.slice.call(args).map(function(arg){
        return util.inspect(arg);
      });
      if (options.stackTrace) {
        var errStack = new Error().stack.split('\n');
        // Remove the 2 top lines from error stack,
        // in order to display the actual file and line number.
        var lines = errStack.slice(3);
        // Allow different levels of verbosity.
        // In this case, display only the first stack item.
        if (options.stackTrace > 0)
          lines = lines.slice(0, options.stackTrace);
        // Finally join lines and display output.
        var line = '\n' + lines.join('\n');
        _args.push(line);
      }
      fn.call(tracer, _args.join(' '));
    }
  };

  // Wrap built-in tracer logging methods.
  this.log = function() {
    output(tracer.log, arguments);
  };

  this.trace = function() {
    output(tracer.trace, arguments);
  };

  this.debug = function() {
    output(tracer.debug, arguments);
  };

  this.info = function() {
    output(tracer.info, arguments);
  };

  this.warn = function() {
    output(tracer.warn, arguments);
  };

  this.error = function() {
    output(tracer.error, arguments);
  };

};

/**
* @version 1.1.2
*/
module.exports = TracerDebug;
