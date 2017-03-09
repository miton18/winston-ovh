// Type definitions for winston-ovh
// Project: https://github.com/miton18/winston-ovh
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="../node/node.d.ts" />

///******************
///  Winston v2.2.x
///******************


declare module "winston" {
  export interface TransportStatic {
    new (options?: TransportOptions): TransportInstance;
  }
}