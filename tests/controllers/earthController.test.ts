import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import supertest = require('supertest');

import { EarthController } from '../../src/controllers/earthController';
import { AdminAuthorizer } from '../../src/middleware/adminAuthorizer';
import { EarthRepository } from '../../src/respository/earthRepository';
import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';
import { EarthService } from '../../src/services/earthService';
import { MockLogger } from '../mocks/mockLogger';

describe('earthController', () => {
  let app: express.Application;
  let mongoMem: MongoMemoryServer;
  let mongoClient: MongoClient;
  const adminToken = 'admin_tokn';
  const adminAuthorizer = new AdminAuthorizer(adminToken);

  beforeEach(async () => {
    mongoMem = new MongoMemoryServer();
    const mongoUri = await mongoMem.getUri('db');
    mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await mongoClient.connect();
    const mongoDb = mongoClient.db();
    const surfZoneRepository = new SurfZoneRepository(mongoDb);
    const earthRepository = new EarthRepository(mongoDb, surfZoneRepository);
    const earthService = new EarthService(earthRepository);
    const earthControllerArgs = { earthService, adminAuthorizer };
    const earthController = new EarthController(
      new MockLogger(),
      earthControllerArgs
    );
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
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
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.CREATED);
    });

    it('double POST returns 409 - Conflict', async () => {
      await supertest(app)
        .post('/earth')
        .send({ name: 'zone-name', zones: [], spots: [] })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.CREATED);

      await supertest(app)
        .post('/earth')
        .send({ name: 'zone-name', zones: [], spots: [] })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.CONFLICT);
    });

    it('invalid child id returns 409 - Conflict', async () => {
      await supertest(app)
        .post('/earth')
        .send({ name: 'zone-name', zones: ['invalid_id'], spots: [] })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.CONFLICT);
    });
    it('no authorizatoin header  returns 401 - unauthorized', async () => {
      await supertest(app)
        .post('/earth')
        .send({ name: 'zone-name', zones: [], spots: [] })
        .set('Content-Type', 'application/json')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /earth', () => {
    it('happyPath returns 200 - OK', async () => {
      await supertest(app)
        .get('/earth')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('no earth returns 404 - Not Found', async () => {
      await supertest(app)
        .get('/earth')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
    it('no authorization header returns 401 - Unauthorized', async () => {
      await supertest(app)
        .get('/earth')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
