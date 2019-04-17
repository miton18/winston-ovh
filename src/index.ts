import Transport from 'winston-transport'
import Gelf from 'gelf-pro'

const levels: {[index: string] : number} = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
}

export interface ovhTransporterOptions {
  token: string
  name?: string
  level?: string
  host?: string
  port?: number
  tls?: boolean
}

export default class ovhTransporter extends Transport {
  level: string = 'info'
  private token: string
  private gelf: any

  constructor(opts: ovhTransporterOptions) {
    super(opts)

    /**
     * Set the level from your options
     */
    if (opts.level) {
      this.level = opts.level
    }

    /**
     * Your OVH Logs Data Platform token
     */
    this.token = opts.token

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

  /**
   * Log a message into Laas
   * @param {string} level
   * @param {string} msg
   * @param {Object} meta
   * @param {Function} callback
   */
  log(info: any, cb: () => void) {
    const { message } = info
    let { level, ...meta } = info
    meta = ovhTransporter.suffixing(meta) // Laas naming logic

    const gelfLevel = levels[level] || 0
    this.gelf.message(message, gelfLevel, meta, cb)
  }

  close() {}

  /**
   * Attempt to preserve meta values type
   * Suffix all properties of object, according to the log data platform
   * @param {Object} o Object to suffix
   * @return {Object} Suffixed object
   */
  static suffixing(o: any) {
    if (typeof o !== 'object') return null

    const n: any = {}
    Object.keys(o).forEach(prop => {
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

          n[prop] = JSON.stringify(v)
      }
    })

    return n
  }
}
