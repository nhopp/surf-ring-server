import { Collection, Db, ObjectID } from 'mongodb';

import { Context } from '../common/context';
import { InvalidSurfZoneError } from '../errors/errors';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';
import { MongoHelper } from './mongoHelper';

export class SurfZoneRepository {
  private static collectionName = 'surfZones';

  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection(SurfZoneRepository.collectionName);
  }

  public async addSurfZone(
    ctx: Context,
    properties: SurfZoneProperties
  ): Promise<SurfZone> {
    for (const zoneId of properties.zones) {
      try {
        await this.getSurfZone(ctx, zoneId);
      } catch (err) {
        ctx.logger.error(`surfZone child does not exist id=${zoneId}`);
        return Promise.reject(new InvalidSurfZoneError(zoneId));
      }
    }

    const result = await this.collection.insertOne(properties);
    const id = result.insertedId;
    return new SurfZone(id.toHexString(), properties);
  }

  public async getSurfZone(ctx: Context, id: string): Promise<SurfZone> {
    let objectId: ObjectID;

    try {
      objectId = new ObjectID(id);
    } catch (error) {
      ctx.logger.error(`invalid objectId=${error}`);
      return Promise.reject(new InvalidSurfZoneError(id));
    }

    const zoneBson = await this.collection.findOne({ _id: objectId });

    if (zoneBson === null) {
      ctx.logger.error(`could not find surfZone id=${id}`);
      return Promise.reject(new InvalidSurfZoneError(id));
    }

    return MongoHelper.surfZoneFromBson(zoneBson);
  }
}
