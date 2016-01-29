# tracer-debug

This is a wrapper for [tracer](https://www.npmjs.com/package/tracer), a logging library for node.js.

With `tracer-debug` all output is conveniently hidden when running in production environments.

## Options
This program accepts the same options as `tracer`, plus the `stackTrace` property.
If `stackTrace` is set to `true`, the error stack trace will be shown after the debug message.

## Example

Create the file `prove.js`:

```
var TLogger = require('./tracer-debug/tracer-debug.js');

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
