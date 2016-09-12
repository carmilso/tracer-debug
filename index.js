/**
* Constructor.
* @param options Configuration options. See https://www.npmjs.com/package/tracer for all the possibilities.
* @param options.displayWhen {Boolean} Condition to show output. If evaluated to false, no output messages will be shown.
* @param options.stackTrace {Boolean|Number} Display stack trace (default: false). Accepts different levels of verbosity; e.g. stackTrace is 1 it will display the first line of the stack, if stackTrace is 2 it will display the 2 first lines of the stack, and so on. If stackTrace is true, the *complete* stack trace will be reported.
* @param options.inspectOptions {Object} Inspection options. See https://nodejs.org/api/util.html#util_util_inspect_object_options
*/
function TracerDebug(options) {

  // Set default options, if not provided.
  var extend = require('extend');
  options = extend(true, {
    // Tracer options begin here.
    format: "{{timestamp}} {{message}}",
    dateformat: "HH:MM:ss.L",
    // TracerDebug options begin here.
    // Custom condition for output to be shown.
    // Default: display messages if not running in production.
    displayWhen: process.env.NODE_ENV !== undefined &&
                 process.env.NODE_ENV !== 'production',
    // Since util.inspect is used internally, configure it here.
    inspectOptions: {
      // Display 'non-enumerable' properties.
      showHidden: false,
      // Nested object levels to recurse. Using null will show every level.
      depth: null
    },
    // Whether to show the stack trace after displaying each output message.
    // Verbosity levels are possible (stackTrace > 0).
    stackTrace: false
  }, options);

  // Now "decorate" the tracer package.
  var tracer = require('tracer').colorConsole(options);
  var util   = require('util');
  // Display log messages as long as the displayWhen option holds true.
  var isDebug = options.displayWhen == true;

  // Private generic output function.
  function output(fn, args) {
    if (!isDebug) return false;
    // Cast arguments to their native type, for pretty ouput.
    var _args = Array.prototype.slice.call(args).map(function(arg) {
      // Note: util.inspect is a stringification method,
      // so use it for complex args only.
      return typeof arg === 'object'
              ? util.inspect(arg, options.inspectOptions)
              : arg;
    });
    if (options.stackTrace) {
      var errStack = new Error().stack.split('\n');
      // Remove the 2 top lines from error stack,
      // in order to display the actual file and line number.
      var lines = errStack.slice(3);
      // Allow different levels of verbosity.
      if (typeof options.stackTrace === 'number' && options.stackTrace > 0)
        lines = lines.slice(0, options.stackTrace);
      // Finally join lines and display output, pretty-print wise.
      var line = '\n' + lines.join('\n').replace(/ +/, '--> ');
      _args.push(line);
    }
    fn.call(tracer, _args.join(' '));
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
