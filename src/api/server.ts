import { MongoClient } from 'mongodb';

import { LoggerConsole } from '../common/loggerConsole';
import { EarthController } from '../controllers/earthController';
import { SurfZonesController } from '../controllers/surfZonesController';
import { EarthRepository } from '../respository/earthRepository';
import { SurfZoneRepository } from '../respository/surfZoneRepository';
import { EarthService } from '../services/earthService';
import { SurfZoneService } from '../services/surfZoneService';
import { App } from './app';

const mongoUrl = 'mongodb://mongo:27017/expressmongo';
// const mongoUrl = 'mongodb://localhost:27017/surf-ring';
const dbName = 'surfSpots';

const mongoClient = new MongoClient(mongoUrl, { useUnifiedTopology: true });

const logger = new LoggerConsole();
logger.info(`connecting to mongo: ${mongoUrl}`);
mongoClient
  .connect()
  .then(() => {
    logger.info(`connecting to mongo: ${mongoUrl}`);
    const mongoDb = mongoClient.db(dbName);
    const surfZoneRepository = new SurfZoneRepository(mongoDb);
    const surfZoneService = new SurfZoneService(surfZoneRepository);
    const surfZonesController = new SurfZonesController(
      logger,
      surfZoneService
    );
    const earthRepository = new EarthRepository(mongoDb, surfZoneRepository);
    const earthService = new EarthService(earthRepository);
    const earthController = new EarthController(logger, earthService);
    const app = new App([earthController, surfZonesController], 8080);

    app.listen();
  })
  .catch((err) => {
    if (err) {
      logger.error(`failed to connect to ${mongoUrl} - ${err}`);
    }
  });
