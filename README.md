# tracer-debug

This is a wrapper for [tracer](https://www.npmjs.com/package/tracer), a logging library for node.js.

With `tracer-debug` all output is conveniently hidden when running in production environments.
It only will be shown if `NODE_ENV` is set and is different from `production`.

## Options

This program accepts the same options as `tracer` (see https://www.npmjs.com/package/tracer), plus the following ones:

### `stackTrace`

If `stackTrace` is set to `true` or `1`, the first line of the stack trace will be shown after the debug message. Different levels of verbosity are possible; e.g. if `stackTrace` is set to 2, the first two lines of the stack trace will be shown after the debug message; and so on. Examples:

```js
var TracerDebug = require('tracer-debug');

// This will display the first line of the stack trace (from caller file).
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

This option controls object inspection, as tracer-debug uses `utils.inspect` internally.

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

Do `npm install` and create the file `prove.js`:

```js
var TracerDebug = require('tracer-debug');

var logger = new TracerDebug({
  format: "<{{title}}> {{message}}",
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

logger.error("foo", typeof "bar");
```

And then call it as `NODE_ENV=debug nodejs prove.js` or `NODE_ENV=development nodejs prove.js` to see the output.
Notice that if you call it as `NODE_ENV=production nodejs prove.js` or simply `nodejs prove.js` no output is shown.
