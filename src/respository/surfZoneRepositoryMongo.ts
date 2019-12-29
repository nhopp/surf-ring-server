import { Collection, Db, ObjectID } from 'mongodb';

import { RepositoryCode } from '../../tests/repositories/repositoryCodes';
import { Context } from '../common/context';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';
import { SurfZoneRepository } from './surfZoneRepository';

export class SurfZoneRepositoryMongo implements SurfZoneRepository {
  private static collectionName = 'surfZones';
  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection(SurfZoneRepositoryMongo.collectionName);
  }

  public getEarthZone(ctx: Context): Promise<SurfZone> {
    throw new Error('Method not implemented.');
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
        return Promise.reject({ code: RepositoryCode.INVALID_ID });
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
      return Promise.reject({ code: RepositoryCode.INVALID_ID });
    }
    const zone = await this.collection.findOne({ _id: objectId });

    if (zone === null) {
      ctx.logger.error(`could not find surfZone id=${id}`);
      return Promise.reject({ code: RepositoryCode.NOT_FOUND });
    }

    return new SurfZone(
      zone._id.toHexString(),
      new SurfZoneProperties(zone.name, zone.zones, zone.spots)
    );
  }
}