import { Transport } from 'winston'
import { hostname } from 'os'
import Gelf from 'gelf-pro'

interface ovhTransporterOptions {
  token: string
  name?: string
  level?: string
  host?: string
}

export default class Transporter extends Transport {

  name: string = 'ovh'
  level: string = 'debug'
  private host: string = hostname()
  private token: string
  private gelf: any

  constructor(opts: ovhTransporterOptions) {
    super()

    /**
     * Name of this logger
     */
    if (opts.name) this.name = opts.name

    /**
     * Set the level from your options
     */
    if (opts.level) this.level = opts.level

    /**
     * log sender identifier
     */
    if (opts.host) this.host = opts.host

    /**
     * Your OVH Logs Data Platform token
     */
    this.token = opts.token

    this.gelf = Gelf.setConfig({
      fields: {
        host: this.host,
        "X-OVH-TOKEN": this.token,
      },
      adapterName: 'tcp',
      adapterOptions: {
        host: 'discover.logs.ovh.com',
        port: 2202,
        family: 4, // IP stack,
        timeout: 1000  // 1s
      },
      levels: {
        error: 1,
        warn: 2,
        info: 3,
        verbose: 5,
        debug: 4,
        silly: 6
      }
    })
  }

  /**
   * Log a message into Laas
   * @param {string} level
   * @param {string} msg
   * @param {Object} meta
   * @param {Function} callback
   */
  log(level: string, msg: string, meta: any, cb: Function) {

    //meta = Transporter.suffixing(meta) // Laas naming logic
    const errorHandler = (err: any) => {
      if (err)
        return cb(new Error(`Failed to send log ${ err }`), level, msg, meta)
      cb(null, true)
    }

    // Unsupported method types
    switch (level) {
      case 'verbose':
        level = 'notice'
        break;
      case 'silly':
        level = 'debug'
        break
      default:
        break;
    }

    if (this.gelf[level] === undefined)
      return cb(new Error(`Unknow log level ${ level }`), level, msg, meta)
    this.gelf[level](msg, meta, errorHandler)
  }

  /**
   * [DISABLED] attempt to preserve meta values type
   * Suffix all properties of object, according to the log data platform
   * @param {Object} o Object to suffix
   * @return {Object} Suffixed object
   */
  static suffixing(o: any) {
    if (typeof o !== 'object') return null

    const n: any = {}
    for (let prop in o) {
      if (!o[prop]) continue

      switch (typeof o[prop]) {
        case 'number':
          n[prop + '_double'] = o[prop]
          break

        case 'boolean':
          n[prop + '_bool'] = o[prop]
          break

        case 'string':
          let pos = o[prop].split(',')
          // Can be Geo position
          if (pos.length === 2)
            n[prop + '_geolocation'] = o[prop]
          else
            n[prop] = o[prop]
          break

        // it's an object
        default:
          if (o[prop] instanceof Date)
            n[prop + '_date'] = o[prop].toISOString()
          else
            n[prop] = JSON.stringify(o[prop])
      }
    }
    return n
  }
}
