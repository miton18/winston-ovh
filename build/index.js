"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var os_1 = require("os");
var gelf_pro_1 = __importDefault(require("gelf-pro"));
var Transporter = /** @class */ (function (_super) {
    __extends(Transporter, _super);
    function Transporter(opts) {
        var _this = _super.call(this) || this;
        _this.name = 'ovh';
        _this.level = 'debug';
        _this.host = os_1.hostname();
        /**
         * Name of this logger
         */
        if (opts.name)
            _this.name = opts.name;
        /**
         * Set the level from your options
         */
        if (opts.level)
            _this.level = opts.level;
        /**
         * log sender identifier
         */
        if (opts.host)
            _this.host = opts.host;
        /**
         * Your OVH Logs Data Platform token
         */
        _this.token = opts.token;
        _this.gelf = gelf_pro_1.default.setConfig({
            fields: {
                host: _this.host,
                "X-OVH-TOKEN": _this.token,
            },
            adapterName: opts.tls ? 'tcp-tls' : 'tcp',
            adapterOptions: {
                host: opts.ldpHost || 'discover.logs.ovh.com',
                port: opts.ldpPort || 2202,
                family: 4,
                timeout: 1000 // 1s
            },
            levels: {
                error: 1,
                warn: 2,
                info: 3,
                verbose: 5,
                debug: 4,
                silly: 6
            }
        });
        return _this;
    }
    /**
     * Log a message into Laas
     * @param {string} level
     * @param {string} msg
     * @param {Object} meta
     * @param {Function} callback
     */
    Transporter.prototype.log = function (level, msg, meta, cb) {
        //meta = Transporter.suffixing(meta) // Laas naming logic
        var errorHandler = function (err) {
            if (err)
                return cb(new Error("Failed to send log " + err), level, msg, meta);
            cb(null, true);
        };
        // Unsupported method types
        switch (level) {
            case 'verbose':
                level = 'notice';
                break;
            case 'silly':
                level = 'debug';
                break;
            default:
                break;
        }
        if (this.gelf[level] === undefined)
            return cb(new Error("Unknow log level " + level), level, msg, meta);
        this.gelf[level](msg, meta, errorHandler);
    };
    /**
     * [DISABLED] attempt to preserve meta values type
     * Suffix all properties of object, according to the log data platform
     * @param {Object} o Object to suffix
     * @return {Object} Suffixed object
     */
    Transporter.suffixing = function (o) {
        if (typeof o !== 'object')
            return null;
        var n = {};
        for (var prop in o) {
            if (!o[prop])
                continue;
            switch (typeof o[prop]) {
                case 'number':
                    n[prop + '_double'] = o[prop];
                    break;
                case 'boolean':
                    n[prop + '_bool'] = o[prop];
                    break;
                case 'string':
                    var pos = o[prop].split(',');
                    // Can be Geo position
                    if (pos.length === 2)
                        n[prop + '_geolocation'] = o[prop];
                    else
                        n[prop] = o[prop];
                    break;
                // it's an object
                default:
                    if (o[prop] instanceof Date)
                        n[prop + '_date'] = o[prop].toISOString();
                    else
                        n[prop] = JSON.stringify(o[prop]);
            }
        }
        return n;
    };
    return Transporter;
}(winston_1.Transport));
exports.default = Transporter;
