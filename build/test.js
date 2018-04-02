"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var index_1 = __importDefault(require("./index"));
var logger = new winston_1.Logger({
    level: 'silly',
    transports: [
        new (winston_1.transports.Console)(),
        new index_1.default({
            token: 'YOUR_TOKEN',
            level: 'silly'
        })
    ]
});
logger.error('test error', { some: true });
logger.warn('test warn', { myField: 'test' });
logger.info('test info', { myNumber: 50 });
logger.debug('test debug');
logger.verbose('test verbose', { place: '48.4070554,-4.495554' });
logger.silly('test silly');
