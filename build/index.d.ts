import Transport from 'winston-transport';
export interface ovhTransporterOptions {
    token: string;
    name?: string;
    level?: string;
    host?: string;
    port?: number;
    tls?: boolean;
}
export default class ovhTransporter extends Transport {
    level: string;
    private token;
    private gelf;
    constructor(opts: ovhTransporterOptions);
    readonly name: string;
    /**
     * Log a message into Laas
     * @param {string} level
     * @param {string} msg
     * @param {Object} meta
     * @param {Function} callback
     */
    log(info: any, cb: () => void): void;
    close(): void;
    /**
     * Attempt to preserve meta values type
     * Suffix all properties of object, according to the log data platform
     * @param {Object} o Object to suffix
     * @return {Object} Suffixed object
     */
    static suffixing(o: any): any;
}
