import { expect } from 'chai';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { ContextImp } from '../../src/common/context';
import { DuplicateEntryError, InvalidSurfZoneError, NotFoundError } from '../../src/errors/errors';
import { EarthRepository } from '../../src/respository/earthRepository';
import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';
import { EarthService } from '../../src/services/earthService';
import { MockLogger } from '../mocks/mockLogger';

describe('EarthService', () => {
  const ctx = new ContextImp(new MockLogger());
  let repository: EarthRepository;
  let service: EarthService;
  let mongoClient: MongoClient;
  let mongoMem: MongoMemoryServer;

  beforeEach(async () => {
    mongoMem = new MongoMemoryServer();
    const mongoUri = await mongoMem.getUri('db');
    mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await mongoClient.connect();
    const mongoDb = mongoClient.db();
    const surfZoneRepository = new SurfZoneRepository(mongoDb);

    repository = new EarthRepository(mongoDb, surfZoneRepository);
    service = new EarthService(repository);
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongoMem.stop();
  });

  describe('getEarth', () => {
    it('happyPath', async () => {
      const earthProps = { name: 'earth', zones: [], spots: [] };
      const createdEarth = await service.addEarth(ctx, earthProps);
      const foundEarth = await service.getEarth(ctx);

      expect(foundEarth).to.deep.eq(createdEarth);
    });

    it('no earth rejects NotFoundError', async () => {
      const error = await service.getEarth(ctx).catch((err) => err);
      expect(error).to.be.an.instanceOf(NotFoundError);
    });
  });

  describe('addEarth', () => {
    it('happyPath', async () => {
      const earthName = 'earth';
      const earthProps = { name: earthName, zones: [], spots: [] };

      const addedEarth = await service.addEarth(ctx, earthProps);

      expect(addedEarth.id).to.not.eq(undefined);
      expect(addedEarth.name).to.be.eq(earthName);
      expect(addedEarth.zones).to.be.deep.eq([]);
      expect(addedEarth.spots).to.be.deep.eq([]);
    });

    it('double addEarth rejects DuplicateEntryError', async () => {
      const earthPropsOne = { name: 'earth', zones: [], spots: [] };
      const earthPropsTwo = { name: 'earth', zones: [], spots: [] };

      await service.addEarth(ctx, earthPropsOne);
      const error = await service
        .addEarth(ctx, earthPropsTwo)
        .catch((err) => err);

      expect(error).to.be.an.instanceOf(DuplicateEntryError);
    });

    it('invalid surfZone child rejects InvalidSurfZoneError', async () => {
      const earthProps = {
        name: 'earth',
        zones: ['invalid_id'],
        spots: []
      };

      const error = await service.addEarth(ctx, earthProps).catch((err) => err);

      expect(error).to.be.an.instanceOf(InvalidSurfZoneError);
    });
  });
});
