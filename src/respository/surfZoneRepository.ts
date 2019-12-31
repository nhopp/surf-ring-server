import { Context } from '../common/context';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';

export interface SurfZoneRepository {
  getSurfZone(ctx: Context, id: string): Promise<SurfZone | undefined>;
  addSurfZone(ctx: Context, properties: SurfZoneProperties): Promise<SurfZone>;
}
