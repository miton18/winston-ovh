# winston-ovh

An OVH Logs data platform transport for NodeJS [Winston][0] logger.

## Motivation

`tldr;?`: To break the [winston][0] codebase into small modules that work
together.

The [winston][0] codebase has been growing significantly with contributions and
other logging transports. This is **awesome**. However, taking a ton of
additional dependencies just to do something simple like logging to the Console
and a File is overkill.

## Installation

```sh
npm install --save winston-ovh
```

## Usage

```js
import { createLogger, transports } from 'winston'
import ovhTransporter from 'winston-ovh'

const logger = createLogger({
  level: 'silly',
  transports: [
    new transports.Console(),
    new ovhTransporter({
      host: 'graxxx.logs.ovh.com',
      token: 'YOUR_TOKEN',
      level: 'silly'
    })
  ]
})

logger.error('test error', { some: true })
logger.warn('test warn', { myField: 'test' })
logger.info('test info', { myNumber: 50 })
logger.debug('test debug')
logger.verbose('test verbose', { place: '48.4070554,-4.495554' })
logger.silly('test silly')
```

The ovh transport takes the following options. 'token' is required:

* __token:__ Logs data platform key
* __level:__ Level of messages that this transport should log, defaults to 'debug'
* __host:__ Logs data platform endpoint

Due to LAAS naming conventions, all meta data must be suffixing with his type.
Ex:
myBool => myBool_bool
myNumber => myNumber_int

Don't take care of it, winston-ovh will suffix your data

[0]: https://github.com/flatiron/winston
