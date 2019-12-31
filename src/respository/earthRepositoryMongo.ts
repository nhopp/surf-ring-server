import { Collection, Db } from 'mongodb';

import { RepositoryCode } from '../../tests/repositories/repositoryCodes';
import { Context } from '../common/context';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';
import { EarthRepository } from './earthRepository';
import { MongoHelper } from './mongoHelper';
import { SurfZoneRepository } from './surfZoneRepository';

export class EarthRepositoryMongo implements EarthRepository {
  private static collectionName = 'earth';

  private surfZoneRepository: SurfZoneRepository;
  private collection: Collection;

  constructor(db: Db, surfZoneRepository: SurfZoneRepository) {
    this.surfZoneRepository = surfZoneRepository;
    this.collection = db.collection(EarthRepositoryMongo.collectionName);
  }

  public async addEarth(
    ctx: Context,
    properties: SurfZoneProperties
  ): Promise<SurfZone> {
    const oldEarthBson = await this.getEarthBson();
    if (oldEarthBson !== null) {
      return Promise.reject({ code: RepositoryCode.DUPLICATE_ENTRY });
    }

    for (const zoneId of properties.zones) {
      try {
        await this.surfZoneRepository.getSurfZone(ctx, zoneId);
      } catch (err) {
        ctx.logger.error(`surfZone child does not exist id=${zoneId}`);
        return Promise.reject({ code: RepositoryCode.INVALID_ID });
      }
    }

    const result = await this.collection.insertOne(properties);
    const id = result.insertedId;
    return new SurfZone(id.toHexString(), properties);
  }

  public async getEarth(ctx: Context): Promise<SurfZone> {
    const earthBson = await this.getEarthBson();

    if (earthBson === null) {
      return Promise.reject({ code: RepositoryCode.NOT_FOUND });
    }

    return MongoHelper.surfZoneFromBson(earthBson);
  }

  private async getEarthBson(): Promise<any> {
    const earthBson = await this.collection.findOne({});
    return earthBson;
  }
}
