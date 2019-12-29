import { Context } from '../../src/common/context';
import { SurfZone } from '../../src/models/surfZone';
import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';

export class MockSurfZoneRepository implements SurfZoneRepository {
  public getEarthZone(c: Context): Promise<SurfZone> {
    throw new Error('Method not implemented.');
  }
  public getSurfZone(c: Context, id: string): Promise<SurfZone | undefined> {
    throw new Error('Method not implemented.');
  }
  public addSurfZone(c: Context, surfZone: SurfZone): Promise<SurfZone> {
    throw new Error('Method not implemented.');
  }
}
