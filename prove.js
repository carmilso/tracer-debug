#!/usr/bin/env nodejs

// This is a simple usage example.

var TracerDebug;
try {
  // NPM installs: use the node_modules file.
  TracerDebug = require('tracer-debug');
} catch(err) {
  // Local test: use the local file.
  TracerDebug = require('./tracer-debug');
}

console.log("** BEGIN FILE:", process.argv.join(' '), "ENV:", process.env.NODE_ENV);

// Just customize a couple of options.
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

console.log("** END OF FILE\n");
