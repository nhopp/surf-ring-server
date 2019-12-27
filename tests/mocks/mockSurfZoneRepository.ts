import { SurfZone } from '../../src/models/surfZone';
import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';

export class MockSurfZoneRepository implements SurfZoneRepository {
  public getEarthZone(): Promise<SurfZone> {
    throw new Error('Method not implemented.');
  }
  public getSurfZone(id: string): Promise<SurfZone | undefined> {
    throw new Error('Method not implemented.');
  }
  public addSurfZone(surfZone: SurfZone): Promise<SurfZone> {
    throw new Error('Method not implemented.');
  }
}
