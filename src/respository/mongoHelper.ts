import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';

export class MongoHelper {
  public static surfZoneFromBson(zoneBson: any): SurfZone {
    return new SurfZone(
      zoneBson._id.toHexString(),
      new SurfZoneProperties(zoneBson.name, zoneBson.zones, zoneBson.spots)
    );
  }
}
