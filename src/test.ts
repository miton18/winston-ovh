import { createLogger, transports } from 'winston'
import ovhTransporter from'./index'

const logger = createLogger({
  level: 'silly',
  transports: [
    new transports.Console(),
    new ovhTransporter({
      host: 'graxxx.logs.ovh.com',
      token: 'TOKEN',
      level: 'silly'
    })
  ]
})

logger.error('test error', {some: true})
logger.warn('test warn', {myField: 'test'})
logger.info('test info', {myNumber: 50, myFloat: 30.001})
logger.debug('test debug')
logger.verbose('test verbose', {place: '48.4070554,-4.495554'})
logger.silly('test silly')
