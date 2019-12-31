import { expect } from 'chai';
import * as Sinon from 'sinon';

import { ContextImp } from '../../src/common/context';
import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';
import { ServiceCode } from '../../src/services/serviceCodes';
import { SurfZoneService } from '../../src/services/surfZoneService';
import { MockData } from '../data/mockData';
import { MockLogger } from '../mocks/mockLogger';
import { MockSurfZoneRepository } from '../mocks/mockSurfZoneRepository';

describe('SurfZoneService', () => {
  const ctx = new ContextImp(new MockLogger());
  let repository: SurfZoneRepository;
  let service: SurfZoneService;

  beforeEach(() => {
    repository = new MockSurfZoneRepository();
    service = new SurfZoneService(repository);
  });

  describe('getSurfZone', () => {
    it('get with invalid id returns NOT_FOUND error', async () => {
      const stub = Sinon.stub(repository, 'getSurfZone').resolves(undefined);

      const surfZoneError = await service
        .getSurfZone(ctx, 'invalidKey')
        .catch((err) => err);

      expect(stub.calledOnce).to.equal(true);
      expect(surfZoneError).to.deep.eq({ code: ServiceCode.NOT_FOUND });
    });

    it('get with valid id returns surfZone', async () => {
      const zoneId = 'valid_id';
      const zone = { id: zoneId, name: '', zones: [], spots: [] };
      const stub = Sinon.stub(repository, 'getSurfZone').resolves(zone);

      const surfZone = await service.getSurfZone(ctx, MockData.surfZoneKey);
      expect(stub.calledOnce).to.equal(true);
      expect(surfZone).to.deep.eq(zone);
    });
  });
});
