import { SurfZoneProperties } from './surfZoneProperties';

export class SurfZone extends SurfZoneProperties {
  public id: string;
  constructor(id: string, properties: SurfZoneProperties) {
    super(properties.name, properties.zones, properties.spots);
    this.id = id;
  }
}
