const util = require('util'),
    winston = require('winston'),
    os = require("os"),
    graylog = require(__dirname + "/vendor/graylog2");

class Transporter {
  
  constructor(opts) {
    /**
     * Name this logger 
     */ 
    this.name = opts.name || 'ovh';
    /**
     * Set the level from your options 
     */
    this.level = opts.level || 'debug';
    /**
     * Configure your storage backing as you see fit
     */
    this.host  = opts.host || os.hostname();
    /**
     * Your OVH Laas token
     */
    this.token = opts.token;

    this.GLog = new graylog.graylog({
      servers: [
          { 'host': 'laas.runabove.com', port: 2202 }
      ],
      // the name of this host 
      hostname: this.host,
      // the facility for these log messages  
      facility: 'Node.js',
      // max UDP packet size, should never exceed the 
      // MTU of your system (optional, default: 1400) 
      bufferSize: 1350         
    }).on('error', function (err) {
      console.error('Error while trying to write to graylog server:', err);
    });

    /**
     * Inherit from `winston.Transport` so you can take advantage 
     * of the base functionality and `.handleExceptions()`. 
     */
    util.inherits(Transporter, winston.Transport);
  }

  /**
   * Log a message into Laas
   * @param {string} msg 
   * @param {string} level 
   * @param {Object} meta 
   * @param {Function} callback 
   */
  log(msg, level, meta, callback) {
    /**
     * Store this message and metadata, maybe use some custom logic 
     * then callback indicating success. 
     */
    let log = {};
    log['X-OVH-TOKEN'] = this.token;
    meta = suffixing(meta)
    log = Transporter.extend(log, meta);
    console.info(log)
    /**
     * We build short message with a part of the entire message
     */ 
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
        case 'silly':
          this.GLog.debug(msg.slice(0, 25) + '...', msg, log);
          break;
        default:
          this.GLog.info(msg.slice(0, 25) + '...', msg, log);
      }
    callback(null, true);
  };

  static extend(obj, ext) {
    for (let prop in ext) {
      obj[prop] = ext[prop];
    }
    return obj;
  }
}

/**
 * Suffix all properties of object
 * @param {Object} o Object to suffix
 * @return {Object} Suffixed object
 */
function suffixing(o) {
  if (typeof o !== 'object') return null;
  let n = {};
  for (let prop in o) {
    switch (typeof o[prop]) {
      case 'number':
        n[prop + '_double'] = o[prop];
        break;
      case 'boolean': 
        n[prop + '_bool'] = o[prop];
        break;
      default:
        // missing 2 types Date and geo
        if (n[prop] instanceof Date) {
          n[prop + '_date'] = o[prop].toISOString();
        } 
        else {
          let pos = o[prop].split(',');
          if (pos.length === 2) {
            n[prop + '_geolocation'] = o[prop];
          } else {
            n[prop] = o[prop];
          }
        }
    }
  }
  return n;
}

module.exports = {
  Transporter
};
