let winston = require('winston');

require('./index');


let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.ovh)({ 
      token: "" 
    })
  ]
});

logger.level = 'silly';

logger.error('test error', {debug: true});
logger.warn('test warn', {warn: true});
logger.info('test info');
logger.verbose('test verbose');
logger.debug('test debug');
logger.silly('test silly');
return;