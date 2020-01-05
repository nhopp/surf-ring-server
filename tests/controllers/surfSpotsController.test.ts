import * as express from 'express';
import * as faker from 'faker';
import * as HttpStatus from 'http-status-codes';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as sinon from 'sinon';
import supertest = require('supertest');

import { SurfSpotsController } from '../../src/controllers/surfSpotsController';
import { SurfSpot } from '../../src/models/surfSpot';
import { SurfSpotProperties } from '../../src/models/surfSpotProperties';
import { SurfSpotRepository } from '../../src/respository/surfSpotRepository';
import { SurfSpotService } from '../../src/services/surfSpotService';
import { MockLogger } from '../mocks/mockLogger';

describe('surfSpotsController', () => {
  let app: express.Application;
  let mongoMem: MongoMemoryServer;
  let mongoClient: MongoClient;
  let service: SurfSpotService;

  before(async () => {
    mongoMem = new MongoMemoryServer();
    const mongoUri = await mongoMem.getUri('db');
    mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await mongoClient.connect();
    const mongoDb = mongoClient.db();
    const repository = new SurfSpotRepository(mongoDb);
    service = new SurfSpotService(repository);
    const surfSpotsController = new SurfSpotsController(
      new MockLogger(),
      service
    );
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(surfSpotsController.router);
  });

  after(async () => {
    await mongoClient.close();
    await mongoMem.stop();
  });

  describe('POST /surf-spots', () => {
    it('happyPath 201 - Created', async () => {
      await supertest(app)
        .post('/surf-spots')
        .send(createSurfSpotProperties())
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CREATED);
    });
  });

  describe('GET /surf-spots/:id', () => {
    it('invalid id returns 404', async () => {
      await supertest(app)
        .get('/surf-spots/invalidKey')
        .expect(HttpStatus.NOT_FOUND);
    });
    it('happyPath', async () => {
      const properties = createSurfSpotProperties();
      const surfSpot = new SurfSpot('valid_id', properties);
      sinon.stub(service, 'getSurfSpot').resolves(surfSpot);
      await supertest(app)
        .get(`/surf-spots/${surfSpot.id}`)
        .expect(HttpStatus.OK);
      sinon.reset();
    });
  });

  function createSurfSpotProperties(): SurfSpotProperties {
    return new SurfSpotProperties(
      faker.name.findName(),
      faker.lorem.words(10),
      faker.lorem.words(10),
      faker.lorem.word(),
      faker.lorem.word()
    );
  }
});
