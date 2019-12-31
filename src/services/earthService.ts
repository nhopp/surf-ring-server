import { RepositoryCode } from '../../tests/repositories/repositoryCodes';
import { Context } from '../common/context';
import { SurfZone } from '../models/surfZone';
import { SurfZoneProperties } from '../models/surfZoneProperties';
import { EarthRepository } from '../respository/earthRepository';
import { ServiceCode } from './serviceCodes';

export class EarthService {
  private repository: EarthRepository;

  constructor(repository: EarthRepository) {
    this.repository = repository;
  }

  public async getEarth(ctx: Context): Promise<SurfZone> {
    try {
      return await this.repository.getEarth(ctx);
    } catch (error) {
      return Promise.reject({ code: ServiceCode.NOT_FOUND });
    }
  }

  public async addEarth(
    ctx: Context,
    properties: SurfZoneProperties
  ): Promise<SurfZone> {
    try {
      return await this.repository.addEarth(ctx, properties);
    } catch (error) {
      let code = ServiceCode.INTERNAL_SERVER_ERROR;
      switch (error.code) {
        case RepositoryCode.DUPLICATE_ENTRY:
          code = ServiceCode.BAD_REQUEST;
          break;
        case RepositoryCode.INVALID_ID:
          code = ServiceCode.BAD_REQUEST;
          break;
      }

      return Promise.reject({ code });
    }
  }
}
