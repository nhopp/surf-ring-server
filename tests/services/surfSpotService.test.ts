import { expect } from 'chai';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { ContextImp } from '../../src/common/context';
import { NotFoundError } from '../../src/errors/errors';
import { SurfSpotProperties } from '../../src/models/surfSpotProperties';
import { SurfSpotRepository } from '../../src/respository/surfSpotRepository';
import { SurfSpotService } from '../../src/services/surfSpotService';
import { MockLogger } from '../mocks/mockLogger';

describe('SurfSpotService', () => {
  const ctx = new ContextImp(new MockLogger());
  let service: SurfSpotService;
  let mongoMem: MongoMemoryServer;
  let mongoClient: MongoClient;

  beforeEach(async () => {
    mongoMem = new MongoMemoryServer();
    const mongoUri = await mongoMem.getUri('db');
    mongoClient = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await mongoClient.connect();
    const mongoDb = mongoClient.db();
    const surfSpotRepository = new SurfSpotRepository(mongoDb);
    service = new SurfSpotService(surfSpotRepository);
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongoMem.stop();
  });

  describe('getSurfSpot', () => {
    it('get with invalid id reject NotFoundError', async () => {
      const error = await service
        .getSurfSpot(ctx, 'invalidId')
        .catch((err) => err);

      expect(error).to.be.an.instanceOf(NotFoundError);
    });

    it('get with valid id returns surfZone', async () => {
      const props = new SurfSpotProperties(
        'name',
        'access',
        'additionalInfo',
        'lat',
        'long'
      );
      const addedSpot = await service.addSurfSpot(ctx, props);
      const surfZone = await service.getSurfSpot(ctx, addedSpot.id);

      expect(surfZone).to.deep.eq(addedSpot);
    });
  });
  describe('addSurfSpot', () => {
    it('happyPath', async () => {
      const props = new SurfSpotProperties(
        'name',
        'access',
        'additionalInfo',
        'lat',
        'long'
      );
      const spot = await service.addSurfSpot(ctx, props);

      expect(spot.id).to.not.eq(undefined);
      expect(spot.access).to.be.eq(props.access);
      expect(spot.additionalInfo).to.be.eq(props.additionalInfo);
      expect(spot.latitude).to.be.eq(props.latitude);
      expect(spot.longitude).to.be.eq(props.longitude);
    });
  });
});
