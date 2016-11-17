/**
 * Constructor.
 * @class
 * @author Carlos Millán (Sciling, SL)
 * @author Luis Leiva (Sciling, SL)
 * @param {Object}          options             Configuration options.
 * See https://www.npmjs.com/package/tracer for all the possibilities.
 * @param {Boolean}         options.displayWhen Condition to show output.
 * If evaluated to false, no output messages will be shown.
 * @param {Boolean|Number}  options.stackTrace  Display stack trace (default: `false`).
 * Accepts different levels of verbosity; e.g. stackTrace is `1` it will display the first line of the stack,
 * if stackTrace is `2` it will display the 2 first lines of the stack, and so on.
 * If stackTrace is `true`, the *complete* stack trace will be reported.
 * Notice that this stack is just the stack of the caller function and not an error stack.
 * @example
 * // Instantiate the class.
 * var logger = new TracerDebug();
 * // Displays "hello" 42.
 * logger.log("hello", 42);
 * // Displays an actual error stack.
 * var err = new Error("An error has been thrown.");
 * logger.error(err.stack);
*/
function TracerDebug(options) {

  // Set default options, if not provided.
  var extend = require('extend');
  options = extend(true, {
    // Tracer options begin here.
    inspectOpt: {
      // Nested object levels to recurse. Using `null` will show every level.
      depth: null
    },
    // TracerDebug options begin here.
    // Custom condition for output to be shown.
    // Default: display messages if not running in production.
    displayWhen: process.env.NODE_ENV !== undefined &&
                 process.env.NODE_ENV !== 'production',
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
    if (!isDebug) {
      return false;
    }

    // Cast arguments to their native type, for pretty ouput.
    var _args = Array.prototype.slice.call(args).map(function(arg) {
      // Note: util.inspect is a stringification method,
      // so use it for complex args only.
      return typeof arg === 'object'
              ? util.inspect(arg, options.inspectOpt)
              : arg;
    });

    var output = util.format.apply(fn, _args);

    if (options.stackTrace) {
      var errStack = new Error().stack.split('\n');
      // Remove the 2 top lines from error stack,
      // in order to display the actual file and line number.
      var lines = errStack.slice(3);
      // Allow different levels of verbosity.
      if (typeof options.stackTrace === 'number' && options.stackTrace > 0) {
        lines = lines.slice(0, options.stackTrace);
      }
      // Finally join lines and display output, pretty-print wise.
      var line = '\n' + lines.join('\n').replace(/ +/, '--> ');
      output += line;
    }

    fn.call(tracer, output);
  };

  /**
   * Wrapper of `tracer.log()` method.
   * @type {string}
   */
  this.log = function() {
    output(tracer.log, arguments);
  };

  /**
   * Wrapper of `tracer.trace()` method.
   * @type {string}
   */
  this.trace = function() {
    output(tracer.trace, arguments);
  };

  /**
   * Wrapper of `tracer.debug()` method.
   * @type {string}
   */
  this.debug = function() {
    output(tracer.debug, arguments);
  };

  /**
   * Wrapper of `tracer.info()` method.
   * @type {string}
   */
  this.info = function() {
    output(tracer.info, arguments);
  };

  /**
   * Wrapper of `tracer.warn()` method.
   * @type {string}
   */
  this.warn = function() {
    output(tracer.warn, arguments);
  };

  /**
   * Wrapper of `tracer.error()` method.
   * @type {string}
   */
  this.error = function() {
    output(tracer.error, arguments);
  };

};

module.exports = TracerDebug;
