import { expect } from 'chai';
import * as faker from 'faker';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { ContextImp } from '../../src/common/context';
import { SurfZone } from '../../src/models/surfZone';
import { SurfZoneProperties } from '../../src/models/surfZoneProperties';
import { EarthRepositoryMongo } from '../../src/respository/earthRepositoryMongo';
import { MockLogger } from '../mocks/mockLogger';
import { MockSurfZoneRepository } from '../mocks/mockSurfZoneRepository';
import { RepositoryCode } from './repositoryCodes';

describe('earthZoneRepository', () => {
  const ctx = new ContextImp(new MockLogger());
  const surfZoneRepository = new MockSurfZoneRepository();
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

  describe('addEarth', () => {
    it('happyPath', async () => {
      const repository = new EarthRepositoryMongo(mongoDb, surfZoneRepository);
      const earthName = faker.name.findName();

      const zone = await repository.addEarth(
        ctx,
        new SurfZoneProperties(earthName, [], [])
      );

      expect(zone).to.be.instanceOf(SurfZone);
    });

    it('second addEarth rejects DUPLICATE_ENTRY', async () => {
      const repository = new EarthRepositoryMongo(mongoDb, surfZoneRepository);
      const earthName = faker.name.findName();
      const properties = new SurfZoneProperties(earthName, [], []);

      await repository.addEarth(ctx, properties);
      const error = await repository
        .addEarth(ctx, properties)
        .catch((err) => err);

      expect(error).to.be.deep.eq({ code: RepositoryCode.DUPLICATE_ENTRY });
    });
  });

  describe('getEarth', () => {
    it('no earth found returns NOT_FOUND', async () => {
      const repository = new EarthRepositoryMongo(mongoDb, surfZoneRepository);
      const error = await repository.getEarth(ctx).catch((err) => err);
      expect(error).to.be.deep.eq({ code: RepositoryCode.NOT_FOUND });
    });

    it('happyPath', async () => {
      const repository = new EarthRepositoryMongo(mongoDb, surfZoneRepository);
      const earthName = faker.name.findName();
      const earthAdded = await repository.addEarth(
        ctx,
        new SurfZoneProperties(earthName, [], [])
      );
      const earthFound = await repository.getEarth(ctx);

      expect(earthFound).to.be.deep.eq(earthAdded);
    });
  });
});
