# winston-ovh

An OVH Log As A Service transport for NodeJS [Winston][0] logger.

## Motivation
`tldr;?`: To break the [winston][0] codebase into small modules that work
together.

The [winston][0] codebase has been growing significantly with contributions and
other logging transports. This is **awesome**. However, taking a ton of
additional dependencies just to do something simple like logging to the Console
and a File is overkill.  

## Installation

``` bash
  $ npm install --save winston winston-ovh
```

## Usage
``` js
  const winston = require('winston');
  const winstonOvh = require('winston-ovh');

  let logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new winstonOvh.ovhTransporter({ 
        token: "YOUR_LAAS_TOKEN" 
      })
    ]
  });
```

The ovh transport takes the following options. 'token' is required:

* __token:__ OVH LAAS key
* __name:__ Transport instance identifier. Useful if you need to create multiple transports
* __level:__ Level of messages that this transport should log, defaults to 'debug'
* __host:__ Name of the instance, default is server name


Due to LAAS naming conventions, all meta data must be suffixing with his type.
Ex:
myBool => myBool_bool
myNumber => myNumber_int

Don't take care of it, winston-ovh will suffix your data

[0]: https://github.com/flatiron/winston