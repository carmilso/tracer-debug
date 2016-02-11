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

// Just customize a couple of options.
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
