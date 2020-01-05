import { SurfSpotJson } from './surfSpotJson';

export interface SurfZoneJson {
  name: string;
  zones: SurfZoneJson[];
  spots: SurfSpotJson[];
}
