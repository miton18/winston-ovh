import { createLogger, transports, format } from 'winston'
import ovhTransporter from'./index'

const logger = createLogger({
  level: 'debug',
  format: format.simple(),
  transports: [
    new transports.Console(),
    new ovhTransporter({
      host: 'graxxx.logs.ovh.com',
      token: 'xxxx'
    })
  ],
  exitOnError: true
})

logger.error('test error', {some: true})
logger.warn('test warn', {myField: 'test'})
logger.info('test info', {myNumber: 50, myFloat: 20.001})
logger.debug('test debug')
logger.verbose('test verbose', {place: '48.4070554,-4.495554'})
logger.silly('test silly')
logger.error('test error', {err: new Error('some useful error')})
logger.log({
  level: 'verbose',
  message: 'test'
})
