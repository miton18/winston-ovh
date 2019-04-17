"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const index_1 = __importDefault(require("./index"));
const logger = winston_1.createLogger({
    level: 'debug',
    format: winston_1.format.simple(),
    transports: [
        new winston_1.transports.Console(),
        new index_1.default({
            host: 'graxxx.logs.ovh.com',
            token: 'xxxx'
        })
    ],
    exitOnError: true
});
logger.error('test error', { some: true });
logger.warn('test warn', { myField: 'test' });
logger.info('test info', { myNumber: 50, myFloat: 20.001 });
logger.debug('test debug');
logger.verbose('test verbose', { place: '48.4070554,-4.495554' });
logger.silly('test silly');
logger.error('test error', { err: new Error('some useful error') });
logger.log({
    level: 'verbose',
    message: 'test'
});
