import * as Winston from 'winston';

import { Logger } from './logger';

export class LoggerConsole implements Logger {
  private logger: Winston.Logger;

  constructor() {
    const consoleTransport = new Winston.transports.Console();
    const myWinstonOptions = {
      transports: [consoleTransport]
    };
    this.logger = Winston.createLogger(myWinstonOptions);
  }

  public error(msg: string): void {
    this.logger.error(msg);
  }

  public info(msg: string): void {
    this.logger.info(msg);
  }

  public warn(msg: string): void {
    this.logger.warn(msg);
  }
}
