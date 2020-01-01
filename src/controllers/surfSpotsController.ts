import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

import { ContextImp } from '../common/context';
import { Logger } from '../common/logger';
import { NotFoundError } from '../errors/errors';
import { SurfSpotProperties } from '../models/surfSpotProperties';
import { SurfSpotService } from '../services/surfSpotService';
import { Controller } from './controller';

export class SurfSpotsController implements Controller {
  public readonly router = express.Router();

  constructor(
    private logger: Logger,
    private surfSpotService: SurfSpotService
  ) {
    this.router.get('/surf-spots/:id', this.getSurfSpot.bind(this));
    this.router.post('/surf-spots', this.postSurfSpot.bind(this));
  }

  private async getSurfSpot(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const id = request.params.id;
    const context = new ContextImp(this.logger);
    try {
      const surfSpot = await this.surfSpotService.getSurfSpot(context, id);
      response.json(surfSpot);
    } catch (err) {
      if (err instanceof NotFoundError) {
        response.status(HttpStatus.NOT_FOUND).send({ message: err.message });
      } else {
        next(err);
      }
    }
  }

  private async postSurfSpot(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const properties = request.body as SurfSpotProperties;
    const context = new ContextImp(this.logger);
    try {
      const surfSpot = await this.surfSpotService.addSurfSpot(
        context,
        properties
      );
      response.status(HttpStatus.CREATED).json(surfSpot);
    } catch (err) {
      return next(err);
    }
  }
}
