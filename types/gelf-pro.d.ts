
declare module 'gelf-pro' {
  function setConfig(config: config): any

  interface config {
    fields?: any,
    filter?: any[],
    transform?: any[],
    broadcast?: any[],
    levels?: any,
    aliases?: any,
    adapterName?: string,
    adapterOptions?: any,
  }

  function info(message: string, extra?: any, cb?: (err: any, bytesSend: Number) => void): void
  function error(message: string, extra?: any, cb?: (err: any, bytesSend: Number) => void): void
  function message(message: any, level: Number, extra: any, cb?: (err: any) => void): void
}
