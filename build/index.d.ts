import { Transport } from 'winston';
export interface ovhTransporterOptions {
    token: string;
    name?: string;
    level?: string;
    host?: string;
    ldpHost?: string;
    ldpPort?: number;
}
export default class Transporter extends Transport {
    name: string;
    level: string;
    private host;
    private token;
    private gelf;
    constructor(opts: ovhTransporterOptions);
    /**
     * Log a message into Laas
     * @param {string} level
     * @param {string} msg
     * @param {Object} meta
     * @param {Function} callback
     */
    log(level: string, msg: string, meta: any, cb: Function): any;
    /**
     * [DISABLED] attempt to preserve meta values type
     * Suffix all properties of object, according to the log data platform
     * @param {Object} o Object to suffix
     * @return {Object} Suffixed object
     */
    static suffixing(o: any): any;
}
