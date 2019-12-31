import { Context } from '../common/context';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';


export interface EarthRepository {
  addEarth(c: Context, properties: SurfZoneProperties): Promise<SurfZone>;
  getEarth(c: Context): Promise<SurfZone>;
}
