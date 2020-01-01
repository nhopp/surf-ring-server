import { expect } from 'chai';
import * as faker from 'faker';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { ContextImp } from '../../src/common/context';
import { NotFoundError } from '../../src/errors/errors';
import { SurfSpotProperties } from '../../src/models/surfSpotProperties';
import { SurfSpotRepository } from '../../src/respository/surfSpotRepository';
import { MockLogger } from '../mocks/mockLogger';

describe('SurfSpotRepository', async () => {
  const ctx = new ContextImp(new MockLogger());
  let mongoMem: MongoMemoryServer;
  let mongoClient: MongoClient;
  let mongoDb: Db;

  beforeEach(async () => {
    mongoMem = new MongoMemoryServer();
    const mongoUri = await mongoMem.getUri('db');
    mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await mongoClient.connect();
    mongoDb = mongoClient.db();
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongoMem.stop();
  });

  describe('addSurfSpot', async () => {
    it('happyPath', async () => {
      const repository = new SurfSpotRepository(mongoDb);
      const name = faker.name.findName();
      const access = faker.lorem.words(10);
      const additionalInfo = faker.lorem.words(10);
      const latitude = faker.lorem.word();
      const longitude = faker.lorem.word();

      const properties: SurfSpotProperties = {
        name,
        access,
        additionalInfo,
        latitude,
        longitude
      };
      const surfSpot = await repository.addSurfSpot(ctx, properties);

      expect(surfSpot.id).to.not.eq(undefined);
      expect(surfSpot.name).to.eq(properties.name);
      expect(surfSpot.access).to.eq(properties.access);
      expect(surfSpot.additionalInfo).to.eq(properties.additionalInfo);
      expect(surfSpot.latitude).to.eq(properties.latitude);
      expect(surfSpot.longitude).to.eq(properties.longitude);
    });
  });

  describe('getSurfSpot', () => {
    it('invalid id rejects NotFoundError', async () => {
      const repository = new SurfSpotRepository(mongoDb);
      const error = await repository
        .getSurfSpot(ctx, 'invalid_id')
        .catch((err) => err);

      expect(error).is.an.instanceOf(NotFoundError);
    });

    it('happyPath ', async () => {
      const repository = new SurfSpotRepository(mongoDb);
      const properties = new SurfSpotProperties(
        'name',
        'access',
        'additionalInfo',
        'lat',
        'lon'
      );
      const addedSpot = await repository.addSurfSpot(ctx, properties);
      const gotSpot = await repository.getSurfSpot(ctx, addedSpot.id);

      expect(gotSpot).is.deep.eq(addedSpot);
    });
  });
});
