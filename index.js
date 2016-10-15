  let util = require('util'),
      winston = require('winston'),
      os = require("os"),
      graylog = require(__dirname + "/vendor/graylog2");
 
  let ovh = winston.transports.ovh = function (opts) {
    // 
    // Name this logger 
    // 
    this.name = opts.name || 'ovh';
    // 
    // Set the level from your options 
    // 
    this.level = opts.level || 'debug';
    // 
    // Configure your storage backing as you see fit 
    // 
    this.host  = opts.host || os.hostname();
    this.token = opts.token;

    this.GLog = new graylog.graylog({
      servers: [
          { 'host': 'laas.runabove.com', port: 2202 }
      ],
      hostname: this.host, // the name of this host 
                              // (optional, default: os.hostname()) 
      facility: 'Node.js',     // the facility for these log messages 
                              // (optional, default: "Node.js") 
      bufferSize: 1350         // max UDP packet size, should never exceed the 
                              // MTU of your system (optional, default: 1400) 
    }).on('error', function (error) {
      console.error('Error while trying to write to graylog server:', error);
    });

    this.GLog.close(function(){
    });

    this.extend = (obj, ext) => {
      for (let prop in ext) {
              obj[prop] = ext[prop];
      }
      return obj;
    }
  };
 
  // 
  // Inherit from `winston.Transport` so you can take advantage 
  // of the base functionality and `.handleExceptions()`. 
  // 
  util.inherits(ovh, winston.Transport);
  winston.transports.ovh = ovh;
 
  ovh.prototype.log = function (level, msg, meta, callback) {
    // 
    // Store this message and metadata, maybe use some custom logic 
    // then callback indicating success. 
    // 
    let log = {};
    log['X-OVH-TOKEN'] = this.token;
    log = this.extend(log, meta);
    // We build short message with a part of the entire message
    switch (level) {
        case 'error':
          this.GLog.error(msg.slice(0, 25) + '...', msg, log);
          break;
        case 'warn':
          this.GLog.warning(msg.slice(0, 25) + '...', msg, log);
          break;
        case 'info':
          this.GLog.notice(msg.slice(0, 25) + '...', msg, log);
          break;
        case 'verbose':
          this.GLog.info(msg.slice(0, 25) + '...', msg, log);
          break;
        case 'debug':
          this.GLog.debug(msg.slice(0, 25) + '...', msg, log);
          break;
        // plugin only go to debug level
        //case 'silly':
        //  return 7;
        default:
          this.GLog.info(msg.slice(0, 25) + '...', msg, log);
      }
    callback(null, true);
  };
