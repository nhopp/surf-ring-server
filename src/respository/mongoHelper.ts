import { SurfSpot } from '../models/surfSpot';
import { SurfSpotProperties } from '../models/surfSpotProperties';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';

export class MongoHelper {
  public static surfZoneFromBson(zoneBson: any): SurfZone {
    return new SurfZone(
      zoneBson._id.toHexString(),
      new SurfZoneProperties(zoneBson.name, zoneBson.zones, zoneBson.spots)
    );
  }

  public static surfSpotFromBson(spotBson: any): SurfSpot {
    return new SurfSpot(
      spotBson._id.toHexString(),
      spotBson as SurfSpotProperties
    );
  }
}
