import { Logger } from './logger';

export interface Context {
  readonly transactionId: string;
  readonly logger: Logger;
}

export class ContextImp {
  private static transactionSeed = Date.now();

  public readonly transactionId: string;
  public readonly logger: Logger;

  constructor(logger: Logger) {
    this.transactionId = `szs-${ContextImp.transactionSeed++}`;
    this.logger = logger;
  }
}
