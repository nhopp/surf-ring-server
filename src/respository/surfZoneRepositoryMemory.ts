import { SurfZone } from '../models/surfZone';
import { SurfZoneRepository } from './surfZoneRepository';

export class SurfZoneRepositoryMemory implements SurfZoneRepository {
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
