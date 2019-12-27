import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';

export interface SurfZoneRepository {
  getEarthZone(): Promise<SurfZone>;
  getSurfZone(id: string): Promise<SurfZone | undefined>;
  addSurfZone(properties: SurfZoneProperties): Promise<SurfZone>;
}
