# tracer-debug

This program is basically a wrapper for [tracer](https://www.npmjs.com/package/tracer), a logging library for node.js.

With `tracer-debug` all output can be conveniently hidden at will, e.g. when running in production environments. For instance, you can choose to display output when `NODE_ENV` is different from `production`.

Different configuration options are available, although you'll be (hopefully) ok with the default ones:

```js
var TracerDebug = require('tracer-debug')
  , logger      = new TracerDebug()
  ;

```

## Options

This program accepts the same options as `tracer` (see https://www.npmjs.com/package/tracer), plus the following ones:

### `displayWhen`

This option controls when should output messages be shown. To display output messages, you must specify any "truthy" value or an expression that evaluates to `true`. Examples:

```js
var TracerDebug = require('tracer-debug');

// This will show output messages when no environment is set.
var myLogger = new TracerDebug({
  displayWhen: typeof process.env.NODE_ENV === 'undefined'
});

// This will show output messages when running in a development environment.
var otherLogger = new TracerDebug({
  displayWhen: process.env.NODE_ENV === 'development'
});

myLogger.log("._.");
otherLogger.log("*_*");
```

By default, all messages are not shown when running in production, i.e. `displayWhen` equals to `typeof process.env.NODE_ENV === 'undefined'`.

### `stackTrace`

If `stackTrace` is set to `true`, the full stack trace will be shown. Different levels of verbosity are possible, e.g. if `stackTrace` is set to `1`, the first line of the stack trace will be shown after the output message; if `stackTrace` is set to `2`, the first two lines of the stack trace will be shown after the output message; and so on. Examples:

```js
var TracerDebug = require('tracer-debug');

// This will display the full stack trace (from caller file).
var myLogger = new TracerDebug({
  stackTrace: true
});

// This will display the first 3 lines of the stack trace.
var otherLogger = new TracerDebug({
  stackTrace: 3
});

myLogger.log("hello");
otherLogger.log("world");
```

### `inspectOptions`

This option controls object inspection, as tracer-debug uses `utils.inspect` internally. Examples:

```js
var TracerDebug = require('tracer-debug');

// The following are the default inspection options. You don't need to set them up explicitly.
var myLogger = new TracerDebug({
  inspectOptions: {
    // If true, the output will display 'non-enumerable' properties.
    showHidden: false,
    // Nested object levels to recurse. Using null will show every level.
    depth: null
    // Colorize output? If true, the output will be styled with ANSI color codes.
    colors: false,
    // Custom inspect function. Handle with care.
    customInspect: true
  }
});

var otherLogger = new TracerDebug({
  inspectOptions: { depth: 1 }
});

var sampleObj = { foo: { bar: { baz: { qux: 1 } } } };
myLogger.log(sampleObj);
anotherLogger.log(sampleObj);
```

## Example

Do `npm install` and create the file `test.js`:

```js
var TracerDebug = require('tracer-debug');

var logger = new TracerDebug({
  format: "logger/{{title}}: {{message}}",
  stackTrace: true
});

logger.log(42);

// Notice the stack trace.
(function test() {
  logger.trace('An object:', { foo: 1, bar: { a: 2, b: 3 } });
})();

logger.debug(true, false);

logger.info(1/0, 0/0);

logger.warn(null, undefined);

var err = new Error("An error has been thrown.");
logger.error(err.stack);
```

And then call it as `NODE_ENV=debug nodejs test.js` or `NODE_ENV=development nodejs test.js` to see the output.
Notice that if you call it as `NODE_ENV=production nodejs test.js` or simply `nodejs test.js` no output is shown.
