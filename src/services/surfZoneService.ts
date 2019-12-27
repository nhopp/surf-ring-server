import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';
import { SurfZoneRepository } from '../respository/surfZoneRepository';
import { ServiceCodes } from './serviceCodes';

export class SurfZoneService {
  private repository: SurfZoneRepository;

  constructor(repository: SurfZoneRepository) {
    this.repository = repository;
  }

  public async getEarthZone(): Promise<SurfZone> {
    return this.repository.getEarthZone();
  }

  public async getSurfZone(id: string): Promise<SurfZone> {
    const zone = await this.repository.getSurfZone(id);

    if (zone === undefined) {
      return Promise.reject({ code: ServiceCodes.NOT_FOUND });
    }

    return zone;
  }

  public async addSurfZone(properties: SurfZoneProperties): Promise<SurfZone> {
    return this.addSurfZone(properties);
  }
}
