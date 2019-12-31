import { expect } from 'chai';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { ContextImp } from '../../src/common/context';
import { InvalidSurfZoneError } from '../../src/errors/errors';
import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';
import { SurfZoneService } from '../../src/services/surfZoneService';
import { MockLogger } from '../mocks/mockLogger';

describe('SurfZoneService', () => {
  const ctx = new ContextImp(new MockLogger());
  let service: SurfZoneService;
  let mongoMem: MongoMemoryServer;
  let mongoClient: MongoClient;

  beforeEach(async () => {
    mongoMem = new MongoMemoryServer();
    const mongoUri = await mongoMem.getUri('db');
    mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await mongoClient.connect();
    const mongoDb = mongoClient.db();
    const surfZoneRepository = new SurfZoneRepository(mongoDb);
    service = new SurfZoneService(surfZoneRepository);
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongoMem.stop();
  });

  describe('getSurfZone', () => {
    it('get with invalid id reject InvalidSurfZoneError', async () => {
      const surfZoneError = await service
        .getSurfZone(ctx, 'invalidKey')
        .catch((err) => err);

      expect(surfZoneError).to.be.an.instanceOf(InvalidSurfZoneError);
    });

    it('get with valid id returns surfZone', async () => {
      const zoneProps = { name: '', zones: [], spots: [] };
      const addedZone = await service.addSurfZone(ctx, zoneProps);
      const surfZone = await service.getSurfZone(ctx, addedZone.id);

      expect(addedZone).to.deep.eq(surfZone);
    });
  });
});
