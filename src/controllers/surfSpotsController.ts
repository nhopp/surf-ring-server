import * as express from 'express';
import * as HttpStatus from 'http-status-codes';

import { ContextImp } from '../common/context';
import { Logger } from '../common/logger';
import { NotFoundError } from '../errors/errors';
import { AdminAuthorizer } from '../middleware/adminAuthorizer';
import { SurfSpotProperties } from '../models/surfSpotProperties';
import { SurfSpotService } from '../services/surfSpotService';
import { Controller } from './controller';

export interface SurfSpotControllerArgs {
  surfSpotService: SurfSpotService;
  adminAuthorizer: AdminAuthorizer;
}

export class SurfSpotsController implements Controller {
  private logger: Logger;
  private surfSpotService: SurfSpotService;
  public readonly router = express.Router();

  constructor(logger: Logger, args: SurfSpotControllerArgs) {
    this.logger = logger;
    this.surfSpotService = args.surfSpotService;

    this.router.use(args.adminAuthorizer.middleware.bind(args.adminAuthorizer));

    this.router.get('/surf-spots/:id', this.getSurfSpot.bind(this));
    this.router.post('/surf-spots', this.postSurfSpot.bind(this));
  }

  private async getSurfSpot(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const id = req.params.id;
    const context = new ContextImp(this.logger);
    try {
      const surfSpot = await this.surfSpotService.getSurfSpot(context, id);
      res.json(surfSpot);
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(HttpStatus.NOT_FOUND).send({ message: err.message });
      } else {
        next(err);
      }
    }
  }

  private async postSurfSpot(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const properties = req.body as SurfSpotProperties;
    const context = new ContextImp(this.logger);
    try {
      const surfSpot = await this.surfSpotService.addSurfSpot(
        context,
        properties
      );
      res.status(HttpStatus.CREATED).json(surfSpot);
    } catch (err) {
      return next(err);
    }
  }
}
