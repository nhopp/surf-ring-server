import { Context } from '../common/context';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';
import { SurfZoneRepository } from '../respository/surfZoneRepository';
import { ServiceCode } from './serviceCodes';

export class SurfZoneService {
  private repository: SurfZoneRepository;

  constructor(repository: SurfZoneRepository) {
    this.repository = repository;
  }

  public async getEarthZone(ctx: Context): Promise<SurfZone> {
    return this.repository.getEarthZone(ctx);
  }

  public async getSurfZone(ctx: Context, id: string): Promise<SurfZone> {
    const zone = await this.repository.getSurfZone(ctx, id);

    if (zone === undefined) {
      return Promise.reject({ code: ServiceCode.NOT_FOUND });
    }

    return zone;
  }

  public async addSurfZone(
    ctx: Context,
    properties: SurfZoneProperties
  ): Promise<SurfZone> {
    return this.repository.addSurfZone(ctx, properties);
  }
}
