#!/usr/bin/env nodejs

var TLogger = require('./tracer-debug.js');

var options = {
  format: "{{timestamp}} <{{title}}> {{message}}",
  dateformat: "HH:MM:ss.L",
  env: 'production'
}

var tlogger = new TLogger(options);

tlogger.log(0);
tlogger.trace(1);
tlogger.debug(2);
tlogger.info(3);
tlogger.warn(4);
tlogger.error(5);
