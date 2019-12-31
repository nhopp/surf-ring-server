import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

import { ContextImp } from '../common/context';
import { Logger } from '../common/logger';
import { DuplicateEntryError, InvalidSurfZoneError, NotFoundError } from '../errors/errors';
import { EarthService } from '../services/earthService';
import { Controller } from './controller';

export class EarthController implements Controller {
  public readonly router = express.Router();

  constructor(private logger: Logger, private earthService: EarthService) {
    this.router.get('/earth', this.getEarth.bind(this));
    this.router.post('/earth', this.postEarth.bind(this));
  }

  private async getEarth(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const id = request.params.id;
    const context = new ContextImp(this.logger);
    try {
      const earth = await this.earthService.getEarth(context);
      response.json(earth);
    } catch (err) {
      if (err instanceof NotFoundError) {
        response.status(HttpStatus.NOT_FOUND).send({ message: err.message });
      } else {
        next(err);
      }
    }
  }

  private async postEarth(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const properties = request.body;
    const context = new ContextImp(this.logger);
    try {
      const earth = await this.earthService.addEarth(context, properties);
      response.status(HttpStatus.CREATED).json(earth);
    } catch (err) {
      if (err instanceof InvalidSurfZoneError) {
        response.status(HttpStatus.CONFLICT).send({ message: err.message });
      } else if (err instanceof DuplicateEntryError) {
        response.status(HttpStatus.CONFLICT).send({ message: err.message });
      } else {
        return next(err);
      }
    }
  }
}
