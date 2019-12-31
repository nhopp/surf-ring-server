import { Context } from '../common/context';
import { DuplicateEntryError } from '../errors/errors';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';
import { EarthRepository } from '../respository/earthRepository';

export class EarthService {
  private repository: EarthRepository;

  constructor(repository: EarthRepository) {
    this.repository = repository;
  }

  public async getEarth(ctx: Context): Promise<SurfZone> {
    return await this.repository.getEarth(ctx);
  }

  public async addEarth(
    ctx: Context,
    properties: SurfZoneProperties
  ): Promise<SurfZone> {
    try {
      await this.getEarth(ctx);
      return Promise.reject(new DuplicateEntryError());
    } catch (error) {
      // no-op expect to not find an earth entry
    }

    return await this.repository.addEarth(ctx, properties);
  }
}
