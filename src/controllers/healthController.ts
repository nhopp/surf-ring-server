import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

import { Controller } from './controller';

export class HealthController implements Controller {
  public readonly router = express.Router();

  constructor() {
    this.router.get('/health', this.getHealthHandler.bind(this));
  }

  private getHealthHandler(req: express.Request, res: express.Response) {
    res.sendStatus(HttpStatus.OK);
  }
}
