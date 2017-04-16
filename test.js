const winston = require('winston'),
      winstonOvh = require('./index');

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new winstonOvh.Transporter({
      token: "YOUR_TOKEN"
    })
  ]
});

logger.level = 'silly'; // Highest level

logger.error('test error', {some: true});
logger.warn('test warn', {myField: 'test'});
logger.info('test info', {myNumber: 50});
logger.verbose('test verbose', {place: '48.4070554,-4.495554'});
logger.debug('test debug');
logger.silly('test silly');
