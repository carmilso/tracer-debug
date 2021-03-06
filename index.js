/**
 * Constructor.
 * Creates a `TracerDebug` instance, which is sort of a wrapper of a `Tracer` instance.
 * @class
 *
 * @author Carlos Millán (Sciling, SL)
 * @author Luis Leiva (Sciling, SL)
 * @license MIT
 *
 * @param {Object} options Configuration options.
 * See {@link https://www.npmjs.com/package/tracer} for all the possibilities.
 * TracerDebug supports all Tracer options, plus the following ones.
 *
 * @param {Boolean} [options.inspectOpt] Inspect options (default: `{ depth: null }`).
 * See {@link https://nodejs.org/api/util.html#util_util_inspect_object_options}
 *
 * @param {Boolean} [options.displayWhen] Condition to show output.
 * If evaluated to false, no output messages will be shown.
 * By default, output is shown only when an environment (NODE_ENV) is set and is not "production", i.e.,
 * when `process.env.NODE_ENV !== undefined && process.env.NODE_ENV !== 'production'`.
 *
 * @param {Boolean|Number} [options.stackTrace] Display stack trace (default: `false`).
 * This property also accepts different levels of verbosity; e.g.
 * if stackTrace is `1` it will display the first line of the stack,
 * if stackTrace is `2` it will display the 2 first lines of the stack, and so on.
 * If stackTrace is `true`, the *complete* stack trace will be reported.
 * Notice that this stack is just the stack of the caller function and not an actual error stack.
 *
 * @param {Boolean} [options.singleton] Whether the instance is global or not (default: `false`).
 * See {@link https://nodejs.org/api/util.html#util_util_inspect_object_options}
 *
 * @example
 * // Instantiate the class.
 * var logger = new TracerDebug();
 * // Displays `hello 42` if NODE_ENV is set and is not "production".
 * logger.log("hello", 42);
 * // Displays an actual error stack.
 * var err = new Error("An error has been thrown.");
 * logger.error(err);
 */
function TracerDebug(options) {

  var tracer = require('tracer')
    , util   = require('util')
    , extend = require('extend')
    ;

  // Set default options, if not provided.
  options = extend(true, {
    // Tracer options begin here.
    inspectOpt: {
      // Nested object levels to recurse. Using `null` will show every level.
      depth: null
    },
    // TracerDebug options begin here.
    // Custom condition for output to be shown.
    // Default: display messages if not running in production.
    // By default, debug messages will appear when explicitly running in whatever dev environment.
    displayWhen: process.env.NODE_ENV !== undefined &&
                 process.env.NODE_ENV !== 'production',
    // Whether to show the stack trace after displaying each output message.
    // Verbosity levels are possible (stackTrace > 0).
    stackTrace: false,
    // Whether the instance is global or not.
    // If true, only one TracerDebug instance will be used across your app.
    // This is useful e.g. for unit testing, as it allows to spy on a common instance.
    singleton: false,
  }, options);

  // Exit early if a previous instance already exists.
  if (options.singleton && global['tracer-debug']) {
    return global['tracer-debug'];
  }

  var transport = tracer.colorConsole(options);

  // Display log messages as long as the displayWhen option holds true.
  // This includes truthy conditions as well.
  var isDebug = options.displayWhen == true;

  // Private generic output function.
  function output(fn) {
    if (!isDebug) {
      return false;
    }
    // Cast arguments to their native type, for pretty ouput.
    var args = Array.prototype.slice.call(arguments, 1).map(function(arg) {
      // Note: util.inspect is a stringification method,
      // so use it for complex args only.
      return typeof arg === 'object'
             ? util.inspect(arg, options.inspectOpt)
             : arg;
    });

    var output = util.format.apply(fn, args);

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

    fn.call(transport, output);
  };

  // Now "decorate" the transport methods.
  for (var method in transport) {
    if (typeof transport[method] === 'function') {
      this[method] = output.bind(this, transport[method]);
    }
  }

  /**
   * Access the original tracer instance.
   * This is useful to manipulate non-logging methods, such as `setLevel()`.
   * @return {object}
   */
  this.transport = tracer;

  // In singleton mode, initialize instance.
  if (options.singleton && !global['tracer-debug']) {
    global['tracer-debug'] = this;
  }

};

module.exports = TracerDebug;
