import { Logger, transports, NpmConfigSetLevels } from 'winston'
import ovhTransporter from'./index'

const logger = new Logger({
  level: 'silly',
  transports: [
    new (transports.Console)(),
    new ovhTransporter({
      token: 'YOUR_TOKEN',
      level: 'silly'
    })
  ]
})

logger.error('test error', {some: true})
logger.warn('test warn', {myField: 'test'})
logger.info('test info', {myNumber: 50})
logger.debug('test debug')
logger.verbose('test verbose', {place: '48.4070554,-4.495554'})
logger.silly('test silly')
