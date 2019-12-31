import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest = require('supertest');

import { EarthController } from '../../src/controllers/earthController';
import { EarthRepository } from '../../src/respository/earthRepository';
import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';
import { EarthService } from '../../src/services/earthService';
import { MockLogger } from '../mocks/mockLogger';

describe('surfZonesController', () => {
  let app: express.Application;
  let mongoMem: MongoMemoryServer;
  let mongoClient: MongoClient;

  beforeEach(async () => {
    mongoMem = new MongoMemoryServer();
    const mongoUri = await mongoMem.getUri('db');
    mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await mongoClient.connect();
    const mongoDb = mongoClient.db();
    const surfZoneRepository = new SurfZoneRepository(mongoDb);
    const earthRepository = new EarthRepository(mongoDb, surfZoneRepository);
    const service = new EarthService(earthRepository);
    const earthController = new EarthController(new MockLogger(), service);
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(earthController.router);
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongoMem.stop();
  });

  describe('POST /earth', () => {
    it('happyPath 201 - Created', async () => {
      await supertest(app)
        .post('/earth')
        .send({ name: 'zone-name', zones: [], spots: [] })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CREATED);
    });

    it('double POST returns 409 - Conflict', async () => {
      await supertest(app)
        .post('/earth')
        .send({ name: 'zone-name', zones: [], spots: [] })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CREATED);

      await supertest(app)
        .post('/earth')
        .send({ name: 'zone-name', zones: [], spots: [] })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CONFLICT);
    });

    it('invalid child id returns 409 - Conflict', async () => {
      await supertest(app)
        .post('/earth')
        .send({ name: 'zone-name', zones: ['invalid_id'], spots: [] })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('GET /earth', () => {
    it('happyPath returns 200 - OK', async () => {
      await supertest(app)
        .get('/earth')
        .expect(HttpStatus.NOT_FOUND);
    });
    it('no earth returns 404 - Not Found', async () => {
      await supertest(app)
        .get('/earth')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
