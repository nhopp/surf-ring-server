import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest = require('supertest');

import { SurfZonesController } from '../../src/controllers/surfZonesController';
import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';
import { SurfZoneService } from '../../src/services/surfZoneService';
import { MockLogger } from '../mocks/mockLogger';

describe('surfZonesController', () => {
  let app: express.Application;
  let mongoMem: MongoMemoryServer;
  let mongoClient: MongoClient;

  before(async () => {
    mongoMem = new MongoMemoryServer();
    const mongoUri = await mongoMem.getUri('db');
    mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await mongoClient.connect();
    const mongoDb = mongoClient.db();
    const repository = new SurfZoneRepository(mongoDb);
    const service = new SurfZoneService(repository);
    const surfZonesController = new SurfZonesController(
      new MockLogger(),
      service
    );
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(surfZonesController.router);
  });

  after(async () => {
    await mongoClient.close();
    await mongoMem.stop();
  });

  describe('POST /surf-zones', () => {
    it('happyPath 200 - OK', () => {
      return supertest(app)
        .post('/surf-zones')
        .send({ name: 'zone-name', zones: [], spots: [] })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CREATED);
    });

    it('invalid child node id returns 409 - Conflict', () => {
      return supertest(app)
        .post('/surf-zones')
        .send({ name: 'zone-name', zones: ['invalid_id'], spots: [] })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('GET /surf-zones/:id', () => {
    it('invalid id returns 404', () => {
      return supertest(app)
        .get('/surf-zones/invalidKey')
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
