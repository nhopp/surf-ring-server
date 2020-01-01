import { SurfSpotProperties } from './surfSpotProperties';

export class SurfSpot extends SurfSpotProperties {
  public id: string;
  constructor(id: string, properties: SurfSpotProperties) {
    super(
      properties.name,
      properties.access,
      properties.additionalInfo,
      properties.latitude,
      properties.longitude
    );

    this.id = id;
  }
}
