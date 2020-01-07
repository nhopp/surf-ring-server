import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

import { ContextImp } from '../common/context';
import { Logger } from '../common/logger';
import { InvalidSurfZoneError } from '../errors/errors';
import { AdminAuthorizer } from '../middleware/adminAuthorizer';
import { SurfZoneService } from '../services/surfZoneService';
import { Controller } from './controller';

export interface SurfZonesControllerArgs {
  surfZoneService: SurfZoneService;
  adminAuthorizer: AdminAuthorizer;
}

export class SurfZonesController implements Controller {
  private logger: Logger;
  private surfZoneService: SurfZoneService;
  public readonly router = express.Router();

  constructor(logger: Logger, args: SurfZonesControllerArgs) {
    this.logger = logger;
    this.surfZoneService = args.surfZoneService;

    this.router.use(args.adminAuthorizer.middleware.bind(args.adminAuthorizer));

    this.router.get('/surf-zones/:id', this.getSurfZone.bind(this));
    this.router.post('/surf-zones', this.postSurfZone.bind(this));
  }

  private async getSurfZone(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const id = request.params.id;
    const context = new ContextImp(this.logger);
    try {
      const surfZone = await this.surfZoneService.getSurfZone(context, id);
      response.json(surfZone);
    } catch (err) {
      if (err instanceof InvalidSurfZoneError) {
        response.status(HttpStatus.NOT_FOUND).send({ message: err.message });
      } else {
        next(err);
      }
    }
  }

  private async postSurfZone(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    const properties = request.body;
    const context = new ContextImp(this.logger);
    try {
      const surfZone = await this.surfZoneService.addSurfZone(
        context,
        properties
      );
      response.status(HttpStatus.CREATED).json(surfZone);
    } catch (err) {
      if (err instanceof InvalidSurfZoneError) {
        response.status(HttpStatus.CONFLICT).send({ message: err.message });
      } else {
        return next(err);
      }
    }
  }
}
