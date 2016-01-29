#!/usr/bin/env nodejs

// This is a simple usage example.

var TLogger;
try {
  // NPM installs: use the node_modules file.
  TLogger = require('tracer-debug');
} catch(err) {
  // Local test: use the local file.
  TLogger = require('./tracer-debug');
}

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
