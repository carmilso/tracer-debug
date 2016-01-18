# tracer-debug

## Options
This program accepts the same options as `tracer`, plus the parameter `env`, which specifies the environment in which nodejs is executed (For instance: `"development"` or `"production"`)

## Example
```
var TLogger = require('./tracer-debug/tracer-debug.js');

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
```

And then call your js file with:
`NODE_ENV=debug nodejs prove.js` or `NODE_ENV=production nodejs prove.js`

