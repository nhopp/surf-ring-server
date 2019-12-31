import { Collection, Db } from 'mongodb';

import { Context } from '../common/context';
import { InvalidSurfZoneError, NotFoundError } from '../errors/errors';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';
import { MongoHelper } from './mongoHelper';
import { SurfZoneRepository } from './surfZoneRepository';

export class EarthRepository {
  private static collectionName = 'earth';

  private surfZoneRepository: SurfZoneRepository;
  private collection: Collection;

  constructor(db: Db, surfZoneRepository: SurfZoneRepository) {
    this.surfZoneRepository = surfZoneRepository;
    this.collection = db.collection(EarthRepository.collectionName);
  }

  public async addEarth(
    ctx: Context,
    properties: SurfZoneProperties
  ): Promise<SurfZone> {
    for (const zoneId of properties.zones) {
      try {
        await this.surfZoneRepository.getSurfZone(ctx, zoneId);
      } catch (err) {
        ctx.logger.error(`surfZone child does not exist id=${zoneId}`);
        return Promise.reject(new InvalidSurfZoneError(zoneId));
      }
    }

    const result = await this.collection.insertOne(properties);
    const id = result.insertedId;
    return new SurfZone(id.toHexString(), properties);
  }

  public async getEarth(ctx: Context): Promise<SurfZone> {
    const earthBson = await this.getEarthBson();

    if (earthBson === null) {
      return Promise.reject(new NotFoundError('earth not found'));
    }

    return MongoHelper.surfZoneFromBson(earthBson);
  }

  private async getEarthBson(): Promise<any> {
    const earthBson = await this.collection.findOne({});
    return earthBson;
  }
}
