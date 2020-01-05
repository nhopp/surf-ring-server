import * as config from 'config';
import { MongoClient } from 'mongodb';

import { LoggerConsole } from '../common/loggerConsole';
import { EarthController } from '../controllers/earthController';
import { SurfSpotsController } from '../controllers/surfSpotsController';
import { SurfZonesController } from '../controllers/surfZonesController';
import { EarthRepository } from '../respository/earthRepository';
import { SurfSpotRepository } from '../respository/surfSpotRepository';
import { SurfZoneRepository } from '../respository/surfZoneRepository';
import { EarthService } from '../services/earthService';
import { SurfSpotService } from '../services/surfSpotService';
import { SurfZoneService } from '../services/surfZoneService';
import { App } from './app';

console.log(`------------env: ${process.env.NODE_ENV}`);
const mongoUri = config.get<string>('mongo.uri');
const appPort = config.get<number>('app.port');

const mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });

const logger = new LoggerConsole();
logger.info(`connecting to mongo: ${mongoUri}`);
mongoClient
  .connect()
  .then(() => {
    logger.info(`connected to mongo: ${mongoUri}`);
    const mongoDb = mongoClient.db();
    const surfSpotRepository = new SurfSpotRepository(mongoDb);
    const surfSpotService = new SurfSpotService(surfSpotRepository);
    const surfSpotController = new SurfSpotsController(logger, surfSpotService);
    const surfZoneRepository = new SurfZoneRepository(mongoDb);
    const surfZoneService = new SurfZoneService(surfZoneRepository);
    const surfZonesController = new SurfZonesController(
      logger,
      surfZoneService
    );
    const earthRepository = new EarthRepository(mongoDb, surfZoneRepository);
    const earthService = new EarthService(earthRepository);
    const earthController = new EarthController(logger, earthService);
    const app = new App(
      [earthController, surfZonesController, surfSpotController],
      appPort
    );

    app.listen();
  })
  .catch((err) => {
    if (err) {
      logger.error(`failed to connect to ${mongoUri} - ${err}`);
    }
  });
