const util = require('util'),
    winston = require('winston'),
    os = require("os"),
    Gelf = require('gelf-pro')

class Transporter {

  constructor(opts) {
    /**
     * Name this logger
     */
    this.name = opts.name || 'ovh'
    /**
     * Set the level from your options
     */
    this.level = opts.level || 'debug'
    /**
     * Configure your storage backing as you see fit
     */
    this.host  = opts.host || os.hostname()
    /**
     * Your OVH Laas token
     */
    this.token = opts.token

    this.gelf = Gelf.setConfig({
      fields: {
        facility: 'NodeJS',
        host: this.host,
        "X-OVH-TOKEN": this.token,
        version: "1.1"
      },
      adapterName: 'tcp',
      adapterOptions: {
        host: 'discover.logs.ovh.com',
        port: 2202,
        family: 4, // IP stack,
        timeout: 1000  // 1s
      }
    })

    /**
     * Inherit from `winston.Transport` so you can take advantage
     * of the base functionality and `.handleExceptions()`.
     */
    util.inherits(Transporter, winston.Transport)
  }

  /**
   * Log a message into Laas
   * @param {string} level
   * @param {string} msg
   * @param {Object} meta
   * @param {Function} callback
   */
  log(level, msg, meta, cb) {

    meta = Transporter.suffixing(meta) // Laas naming logic
    let errorHandler = (err) => {
      if (!err)
        cb(null, true);
      else
        cb(new Error("Failed to send log", err), level, msg, meta)
    }

    /**
     * We build short message with a part of the entire message
     */
    switch (level) {
      case 'error':
        this.gelf.error(msg, meta, errorHandler)
        break;
      case 'warn':
        this.gelf.warning(msg, meta, errorHandler)
        break;
      case 'info':
        this.gelf.notice(msg, meta, errorHandler)
        break;
      case 'verbose':
        this.gelf.info(msg, meta, errorHandler)
        break;
      case 'debug':
      case 'silly':
        this.gelf.debug(msg, meta, errorHandler)
    }
  }

  /**
   * Add all properties of ext into obj
   * @param {Object} obj
   * @param {Object} ext
   * @return {Object} union of 2 object
   */
  static extend(obj, ext) {
    for (let prop in ext) {
      obj[prop] = ext[prop]
    }
    return obj
  }

  /**
   * Suffix all properties of object, according to the log data platform
   * @param {Object} o Object to suffix
   * @return {Object} Suffixed object
   */
  static suffixing(o) {
    if (typeof o !== 'object') return null;
    let n = {}
    for (let prop in o) {
      switch (typeof o[prop]) {
        case 'number':
          n[prop + '_double'] = o[prop]
          break
        case 'boolean':
          n[prop + '_bool'] = o[prop]
          break
        default:
          // missing 2 types Date and geo
          if (n[prop] instanceof Date)
            n[prop + '_date'] = o[prop].toISOString()
          else {
            let pos = o[prop].split(',')
            if (pos.length === 2)
              n[prop + '_geolocation'] = o[prop]
            else
              n[prop] = o[prop]
          }
      }
    }
    return n
  }
}



module.exports = {
  Transporter
}
