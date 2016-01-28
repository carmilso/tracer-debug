function TLogger(options) {

  var util   = require('util');
  var tracer = require('tracer').colorConsole(options);
  // Display log messages as long as your program doesn't run in production.
  var isDebug = process.env.NODE_ENV !== undefined &&
                process.env.NODE_ENV !== 'production';

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
        var line = '\n' + errStack.slice(3).join('\n');
        _args.push(line);
      }
      fn.call(tracer, _args.join(' '));
    }
  };

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
module.exports = TLogger;
