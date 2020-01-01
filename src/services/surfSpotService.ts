import { Context } from '../common/context';
import { SurfSpot } from '../models/surfSpot';
import { SurfSpotProperties } from '../models/surfSpotProperties';
import { SurfSpotRepository } from '../respository/surfSpotRepository';

export class SurfSpotService {
  private repository: SurfSpotRepository;

  constructor(repository: SurfSpotRepository) {
    this.repository = repository;
  }

  public async getSurfSpot(ctx: Context, id: string): Promise<SurfSpot> {
    return await this.repository.getSurfSpot(ctx, id);
  }

  public async addSurfSpot(
    ctx: Context,
    properties: SurfSpotProperties
  ): Promise<SurfSpot> {
    return this.repository.addSurfSpot(ctx, properties);
  }
}
