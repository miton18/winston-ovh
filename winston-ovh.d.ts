// Type definitions for winston-ovh
// Project: https://github.com/miton18/winston-ovh
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="../node/node.d.ts" />

///******************
///  Winston-ovh
///******************


declare module "winston-ovh" {
  export class ovhTransporter {
    constructor(config: ovhConfig);
  }

  export interface ovhConfig {
    name?: string;
    level?: string;
    host?: string;
    token: string;
  }
}