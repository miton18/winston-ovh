# winston-ovh

An OVH Log As A Service transport for [winston][0].

## Motivation
`tldr;?`: To break the [winston][0] codebase into small modules that work
together.

The [winston][0] codebase has been growing significantly with contributions and
other logging transports. This is **awesome**. However, taking a ton of
additional dependencies just to do something simple like logging to the Console
and a File is overkill.  

## Installation

``` bash
  $ npm install winston
  $ npm install winston-ovh
```

## Usage
``` js
  let winston = require('winston');
  require('winston-ovh');

  let logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.ovh)({ 
        token: "" 
      })
    ]
  });
```

The ovh transport takes the following options. 'token' is required:

* __token:__ OVH AI key
* __name:__ Transport instance identifier. Useful if you need to create multiple transports
* __level:__ Level of messages that this transport should log, defaults to 'debug'
* __host:__ Name of the instance, default is server name

[0]: https://github.com/flatiron/winston