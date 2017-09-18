#!/usr/bin/env nodejs

// This is a simple usage example.
console.log("** BEGIN TEST:", process.argv.join(' '), "ENV:", process.env.NODE_ENV, "\n");


var TracerDebug;
try {
  // NPM installs: use the node_modules file.
  TracerDebug = require('tracer-debug');
} catch(err) {
  // Local test: use the local file.
  TracerDebug = require('./index');
}

// Just customize a couple of options.
var logger = new TracerDebug({
  // Display function name (title) and actual output (message).
  format: "logger/{{title}}: {{message}}",
  // Display last 2 lines from stack.
  stackTrace: 2
});

logger.log(42);

// Notice the stack trace.
(function test() {
  logger.trace('An object:', { foo: 1, bar: { a: 2, b: 3 } });
})();

// The following examples are just to show the colored output.
logger.debug(true, false);
logger.info(1/0, 0/0);
logger.warn(null, undefined);
logger.error(new Error("An error has been thrown."));

// Let's manipulate the original tracer instance.
logger.transport.setLevel('warn');
logger.log('This message should not be shown!');
logger.warn('hello %s! %j', 'world', { foo: 1 });


console.log("\n** END OF TEST");
