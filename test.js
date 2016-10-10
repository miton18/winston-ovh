let winston = require('winston');

require('./index');


let logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.ovh)({ 
        token: "API_KEY" 
      })
    ]
  });

logger.level = 'silly';

logger.error('test error');
logger.warn('test warn');
logger.info('test info');
logger.verbose('test verbose');
logger.debug('test debug');
logger.silly('test silly');
return;