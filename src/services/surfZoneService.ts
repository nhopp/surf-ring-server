import { Context } from '../common/context';
import { InvalidSurfZoneError } from '../errors/errors';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';
import { SurfZoneRepository } from '../respository/surfZoneRepository';

export class SurfZoneService {
  private repository: SurfZoneRepository;

  constructor(repository: SurfZoneRepository) {
    this.repository = repository;
  }

  public async getSurfZone(ctx: Context, id: string): Promise<SurfZone> {
    const zone = await this.repository.getSurfZone(ctx, id);

    if (zone === undefined) {
      return Promise.reject(new InvalidSurfZoneError(id));
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
