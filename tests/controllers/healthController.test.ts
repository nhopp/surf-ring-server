import * as express from 'express';
import * as HttpStatus from 'http-status-codes';
import supertest = require('supertest');

import { HealthController } from '../../src/controllers/healthController';

describe('healthController', () => {
  let app: express.Application;
  beforeEach(() => {
    app = express();
    app.use(express.json);
    const healthController = new HealthController();
    app.use(healthController.router);
  });

  describe('/health', () => {
    it('happy path 200 OK', () => {
      supertest(app)
        .get('/health')
        .expect(HttpStatus.OK);
    });
  });
});
