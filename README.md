# tracer-debug

This is a wrapper for [tracer](https://www.npmjs.com/package/tracer), a logging library for node.js.

With `tracer-debug` all output is conveniently hidden when running in production environments.
It only will be shown if `NODE_ENV` is set and is different from `production`.

## Options

This program accepts the same options as `tracer`, plus the `stackTrace` property.
If `stackTrace` is set to `true` or `1`, the first line of the stack trace will be shown after the debug message. Different levels of verbosity are possible; e.g. if `stackTrace` is set to 2, the first two lines of the stack trace will be shown after the debug message; and so on.

## Example

Do `npm install` and create the file `prove.js`:

```js
var TLogger = require('tracer-debug');

var options = {
  format      : "{{timestamp}} <{{title}}> {{message}}",
  dateformat  : "HH:MM:ss.L",
  stackTrace  : true
}

var tlogger = new TLogger(options);

tlogger.log(42);

// Notice the stack trace.
(function test() {
  tlogger.trace('An object:', { foo: 1, bar: { a: 2, b: 3 } });
})();

tlogger.debug(true, false);

tlogger.info(1/0, 0/0);

tlogger.warn(null, undefined);

tlogger.error("foo", typeof "bar");
```

And then call it as `NODE_ENV=debug nodejs prove.js` or `NODE_ENV=development nodejs prove.js` to see the output.
Notice that if you call it as `NODE_ENV=production nodejs prove.js` or simply `nodejs prove.js` no output is shown.
