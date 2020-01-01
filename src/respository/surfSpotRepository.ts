import { Collection, Db, ObjectID } from 'mongodb';

import { Context } from '../common/context';
import { NotFoundError } from '../errors/errors';
import { SurfSpotProperties } from '../models/surfSpotProperties';
import { SurfSpot } from './../models/surfSpot';
import { MongoHelper } from './mongoHelper';


export class SurfSpotRepository {
  private static collectionName = 'surfSpots';

  private collection: Collection;

  constructor(db: Db) {
    this.collection = db.collection(SurfSpotRepository.collectionName);
  }

  public async addSurfSpot(
    ctx: Context,
    properties: SurfSpotProperties
  ): Promise<SurfSpot> {
    const result = await this.collection.insertOne(properties);
    const id = result.insertedId;
    return new SurfSpot(id.toHexString(), properties);
  }

  public async getSurfSpot(ctx: Context, id: string): Promise<SurfSpot> {
    let objectId: ObjectID;

    try {
      objectId = new ObjectID(id);
    } catch (error) {
      ctx.logger.error(`invalid objectId=${error}`);
      return Promise.reject(new NotFoundError());
    }

    const zoneBson = await this.collection.findOne({ _id: objectId });

    if (zoneBson === null) {
      ctx.logger.error(`could not find surfZone id=${id}`);
      return Promise.reject(new NotFoundError());
    }

    return MongoHelper.surfSpotFromBson(zoneBson);
  }
}
