const winston = require('winston'),
      winstonOvh = require('./index');

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new winstonOvh.Transporter({ 
      token: "5e786fe7-8737-435e-a894-ad60367acb11" 
    })
  ]
});

logger.level = 'silly';

logger.error('test error', {some: true});
logger.warn('test warn', {myField: 'test'});
logger.info('test info', {myNumber: 50});
logger.verbose('test verbose', {place: '48.4070554,-4.495554'});
logger.debug('test debug');
logger.silly('test silly');