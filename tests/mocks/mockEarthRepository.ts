import { Context } from '../../src/common/context';
import { SurfZone } from '../../src/models/surfZone';
import { SurfZoneProperties } from '../../src/models/surfZoneProperties';
import { EarthRepository } from '../../src/respository/earthRepository';

export class MockEarthRepository implements EarthRepository {
  public async addEarth(
    c: Context,
    properties: SurfZoneProperties
  ): Promise<SurfZone> {
    throw new Error('Method not implemented.');
  }
  public async getEarth(c: Context): Promise<SurfZone> {
    throw new Error('Method not implemented.');
  }
}
