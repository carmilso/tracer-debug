#!/usr/bin/env nodejs

// This is a simple usage example.
console.log("** BEGIN TEST:", process.argv.join(' '), "ENV:", process.env.NODE_ENV, "\n");

var TracerDebug = require('./index');

// Just customize a couple of options.
var logger = new TracerDebug({
  // Display function name (title) and actual output (message).
  format: "logger/{{title}}: {{message}}",
  // Display last 2 lines from stack.
  stackTrace: 2,
  // Use a global instance to reuse them later.
  singleton: true
});

logger.log(42);

// In singleton mode, the output is the same as in the previous `logger` instance.
// If we don't use `singleton: true` a brand new instance is created.
var logger2 = new TracerDebug({ singleton: true });
logger2.log(42);

// Notice the stack trace.
(function test() {
  logger.trace('An object:', { foo: 1, bar: { a: 2, b: 3 } });
})();

// The following examples are just to show the colored output.
// It also showcases how native types are displayed.
logger.debug(true, false);
logger.info(1/0, 0/0);
logger.warn(null, undefined);
logger.error(new Error("An error has been thrown."));

// Let's manipulate the original tracer instance.
logger.transport.setLevel('warn');
logger.log('This message should not be shown!');
logger.warn('hello %s! %j', 'world', { foo: 1 });
// Notice that in singleton mode any modification is populated to other instances.
logger2.log('This message should not be shown!');


console.log("\n** END OF TEST");
