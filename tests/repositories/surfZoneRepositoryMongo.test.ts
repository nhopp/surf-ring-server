import { expect } from 'chai';
import * as faker from 'faker';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { ContextImp } from '../../src/common/context';
import { InvalidSurfZoneError } from '../../src/errors/errors';
import { SurfZoneProperties } from '../../src/models/surfZoneProperties';
import { SurfZoneRepositoryMongo } from '../../src/respository/surfZoneRepositoryMongo';
import { MockLogger } from '../mocks/mockLogger';

describe('SurfZoneRepositoryMongo', async () => {
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

  describe('addSurfZone', async () => {
    it('zone with no sub zones or children', async () => {
      const repository = new SurfZoneRepositoryMongo(mongoDb);
      const zoneName = 'newZoneName';
      const zones: [] = [];
      const spots: [] = [];

      const newZone = await repository.addSurfZone(
        ctx,
        new SurfZoneProperties(zoneName, zones, spots)
      );

      expect(newZone.name).to.eq(zoneName);
      expect(newZone.zones).to.eq(zones);
      expect(newZone.spots).to.eq(spots);
      expect(newZone.id).to.be.a('string');
      expect(newZone.id).to.not.eq('');
    });

    it('zone with valid child zone id', async () => {
      const repository = new SurfZoneRepositoryMongo(mongoDb);
      const zoneName = faker.name.findName();

      const childZone = await repository.addSurfZone(
        ctx,
        new SurfZoneProperties(zoneName, [], [])
      );

      const parentName = faker.name.findName();
      const parentZone = await repository.addSurfZone(
        ctx,
        new SurfZoneProperties(parentName, [childZone.id], [])
      );

      expect(parentZone.name).to.eq(parentName);
      expect(parentZone.zones).to.deep.eq([childZone.id]);
      expect(parentZone.spots).to.deep.eq([]);
      expect(parentZone.id).to.be.a('string');
      expect(parentZone.id).to.not.eq('');
    });

    it('zone with invalid child zone id rejects InvalidSurfZoneError', async () => {
      const repository = new SurfZoneRepositoryMongo(mongoDb);
      const zoneName = faker.name.findName();
      const invalidId = 'invalid_id';

      const error = await repository
        .addSurfZone(ctx, new SurfZoneProperties(zoneName, [invalidId], []))
        .catch((err) => err);

      expect(error).to.be.an.instanceOf(InvalidSurfZoneError);
    });
  });

  describe('getSurfZone', () => {
    it('empty string id rejects with InvalidSurfZoneError', async () => {
      const repository = new SurfZoneRepositoryMongo(mongoDb);
      const error = await repository.getSurfZone(ctx, '').catch((err) => {
        return err;
      });

      expect(error).to.be.an.instanceOf(InvalidSurfZoneError);
    });

    it('missing id rejects with InvalidSurfZoneError', async () => {
      const repository = new SurfZoneRepositoryMongo(mongoDb);
      const error = await repository
        .getSurfZone(ctx, '5e09258d70a7f254196660b3')
        .catch((err) => {
          return err;
        });

      expect(error).to.be.an.instanceOf(InvalidSurfZoneError);
    });

    it('happyPath', async () => {
      const repository = new SurfZoneRepositoryMongo(mongoDb);
      const zoneName = faker.name.findName();
      const properties = new SurfZoneProperties(zoneName, [], []);
      const zone = await repository.addSurfZone(ctx, properties);
      const foundZone = await repository.getSurfZone(ctx, zone.id);

      expect(foundZone).to.be.deep.eq(zone);
    });
  });
});
