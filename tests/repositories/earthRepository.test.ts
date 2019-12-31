import { expect } from 'chai';
import * as faker from 'faker';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { ContextImp } from '../../src/common/context';
import { NotFoundError } from '../../src/errors/errors';
import { SurfZone } from '../../src/models/surfZone';
import { SurfZoneProperties } from '../../src/models/surfZoneProperties';
import { EarthRepository } from '../../src/respository/earthRepository';
import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';
import { MockLogger } from '../mocks/mockLogger';

describe('earthZoneRepository', () => {
  const ctx = new ContextImp(new MockLogger());
  let surfZoneRepository: SurfZoneRepository;
  let mongoMem: MongoMemoryServer;
  let mongoClient: MongoClient;
  let mongoDb: Db;

  beforeEach(async () => {
    mongoMem = new MongoMemoryServer();
    const mongoUri = await mongoMem.getUri('db');
    mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await mongoClient.connect();
    mongoDb = mongoClient.db();
    surfZoneRepository = new SurfZoneRepository(mongoDb);
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongoMem.stop();
  });

  describe('addEarth', () => {
    it('happyPath', async () => {
      const repository = new EarthRepository(mongoDb, surfZoneRepository);
      const earthName = faker.name.findName();

      const zone = await repository.addEarth(
        ctx,
        new SurfZoneProperties(earthName, [], [])
      );

      expect(zone).to.be.instanceOf(SurfZone);
    });
  });

  describe('getEarth', () => {
    it('no earth found rejects NotFoundError', async () => {
      const repository = new EarthRepository(mongoDb, surfZoneRepository);
      const error = await repository.getEarth(ctx).catch((err) => err);
      expect(error).to.be.an.instanceOf(NotFoundError);
    });

    it('happyPath', async () => {
      const repository = new EarthRepository(mongoDb, surfZoneRepository);
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
