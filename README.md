# winston-rollbar [![Build Status](https://secure.travis-ci.org/Ideame/winston-rollbar.png)](http://travis-ci.org/Ideame/winston-rollbar)

A [rollbar][1] transport for [winston][0].

## Installation

``` sh
  $ npm install winston
  $ npm install winston-rollbar
```

## Usage
``` js
  var winston = require('winston');

  //
  // Requiring `winston-rollbar` will expose
  // `winston.transports.Rollbar`
  //
  require('winston-rollbar').Rollbar;

  winston.add(winston.transports.Rollbar, options);
```

The Rollbar transport uses [node-rollbar](https://github.com/rollbar/node_rollbar) behind the scenes.  Options are the following:

* **rollbarAccessToken**:   Rollbar post server item access token.
* **rollbarConfig**:        Rollbar configuration ([more info](https://rollbar.com/docs/project/2757/items_node/)) (optional).
* **metadataAsRequest**:    Uses metadata object as Rollbar's request parameter. (default: **false** will send for **meta.req** if provided)
* **level**:                Level of messages this transport should log. (default: **warn**).
* **silent**:               Boolean flag indicating whether to suppress output (default: **false**).

[0]: https://github.com/flatiron/winston
[1]: https://rollbar.com
[2]: https://github.com/rollbar/node_rollbar