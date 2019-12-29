import { Logger } from '../../src/common/logger';

/**
 * Empty logger
 */
export class MockLogger implements Logger {
  public error(msg: string): void {
    return;
  }

  public info(msg: string): void {
    return;
  }

  public warn(msg: string): void {
    return;
  }
}
