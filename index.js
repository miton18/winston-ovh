  let util = require('util'),
      winston = require('winston'),
      os = require("os"),
      graylog = require("graylog2");
 
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
    this.host = opts.host || os.hostname();
    this.token = opts.token;


    this.winstonLevelsToSyslog = (level) => {
      switch (level) {
        case 'error':
          return 3;
        case 'warn':
          return 4;
        case 'info':
          return 5;
        case 'verbose':
          return 6;
        case 'debug':
          return 7;
        // plugin only go to debug level
        //case 'silly':
        //  return 7;
        default:
          return 5;
      }
    }

    this.GLog = new graylog.graylog({
      servers: [
          { 'host': 'laas.runabove.com', port: 12202 }
      ],
      hostname: this.host, // the name of this host 
                              // (optional, default: os.hostname()) 
      facility: 'Node.js',     // the facility for these log messages 
                              // (optional, default: "Node.js") 
      //bufferSize: 1350         // max UDP packet size, should never exceed the 
                              // MTU of your system (optional, default: 1400) 
    }).on('error', function (error) {
      console.log('Error while trying to write to graylog2:', error);
    });
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

    let log = {
      version: '1.1',
      host: this.host,
      timestamp: Date.now(),
      level: this.winstonLevelsToSyslog(level),
      line: 100
    }
    log['_X-OVH-TOKEN'] = this.token;

    // We build short message with a part of the entire message
    this.GLog.log(msg.slice(0, 25) + '...', msg, log);

    callback(null, true);
  };


  /* GELF
  {"version":"1.1", 
    "host": "example.org", 
    "short_message": "A short GELF message that helps you identify what is going on", 
    "full_message": "Backtrace here more stuff", 
    "timestamp": 1476029130, 
    "level": 1, 
    "_user_id": 9001, 
    "_some_info": 
    "foo", 
    "some_metric_num": 42.0, 
    "_X-OVH-TOKEN":"1d56c7f4-4a7e-43c8-a4e1-8545560366fc"}\0' | openssl s_client -quiet -no_ign_eof  -connect 
  */