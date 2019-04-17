import Transport from 'winston-transport'
import Gelf from 'gelf-pro'

export interface ovhTransporterOptions {
  token: string
  name?: string
  level?: string
  host?: string
  port?: number
  tls?: boolean
}

export default class ovhTransporter extends Transport {
  private token: string
  private gelf: any

  constructor(opts: ovhTransporterOptions) {
    super(opts)

    /**
     * Your OVH Logs Data Platform token
     */
    this.token = opts.token

    this.level = opts.level || 'debug'

    this.gelf = Gelf.setConfig({
      fields: {
        "X-OVH-TOKEN": this.token,
      },
      adapterName: opts.tls === false ? 'tcp' : 'tcp-tls',
      adapterOptions: {
        host: opts.host || 'discover.logs.ovh.com',
        port: opts.port || 12202,
        family: 4, // IP stack,
        timeout: 1000  // 1s
      }
    })
  }

  get name() {
    return 'ovh'
  }

  static getLevel(l: string): number {
    if (~l.indexOf('error')) {
        return 3
    }
    if (~l.indexOf('warn')) {
        return 4
    }
    if (~l.indexOf('info')) {
        return 5
    }
    if (~l.indexOf('verbose')) {
        return 6
    }
    if (~l.indexOf('debug') || ~l.indexOf('silly')) {
      return 7
    }
    return 3
  }

  /**
   * Log a message into Laas
   * @param {string} level
   * @param {string} msg
   * @param {Object} meta
   * @param {Function} callback
   */
  log(info: any, cb: (err?: Error) => void): any {
    setImmediate(() => this.emit('logged', info))

    const { message } = info
    let { level, ...meta } = info
    meta = ovhTransporter.suffixing(meta) // Laas naming logic

    this.gelf.message(message, ovhTransporter.getLevel(level), meta, (err: any) => {
      cb(err as Error)
    })
  }

  // stream version
  // logv() {}

  close() {}

  /**
   * Attempt to preserve meta values type
   * Suffix all properties of object, according to the log data platform
   * @param {Object} o Object to suffix
   * @return {Object} Suffixed object
   */
  static suffixing(o: any) {
    if (typeof o !== 'object') return {}

    if (o.message && o.stack) {

      return {
        error: o.message + ': ' + o.name || o.stack
      }
    }

    const n: any = {}
    Object.keys(o).forEach(prop => {
      if (prop === 'message') return
      if (prop === 'level') return

      const v = o[prop]

      switch (typeof v) {
        case 'number':
          if (v % 1 === 0) {
            n[`_${prop}_long`] = v
            break
          }
          n[`_${prop}_num`] = v
          break

        case 'boolean':
          n[`_${prop}_bool`] = v
          break

        case 'string':
          // Can be Geo position
          if (v.split(',').length === 2) {
            n[`_${prop}_geolocation`] = v
            break
          }

          n[prop] = v
          break

        // it's an object
        default:
          if (v instanceof Date) {
            n[`_${prop}_date`] = v.toISOString()
            break
          }

          if (v instanceof Error) {
            n[prop] = v.name + ': ' + v.message
            break
          }

          try {
            n[prop] = JSON.stringify(v)
          } catch (err) {
            n[prop] = null
          }
      }
    })

    return n
  }
}
