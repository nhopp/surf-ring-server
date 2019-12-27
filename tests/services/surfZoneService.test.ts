import { expect } from 'chai';
import * as Sinon from 'sinon';

import { SurfZoneRepository } from '../../src/respository/surfZoneRepository';
import { ServiceCodes } from '../../src/services/serviceCodes';
import { SurfZoneService } from '../../src/services/surfZoneService';
import { MockData } from '../data/mockData';
import { MockSurfZoneRepository } from '../mocks/mockSurfZoneRepository';

describe('SurfZoneService', () => {
  let repository: SurfZoneRepository;
  let service: SurfZoneService;

  beforeEach(() => {
    repository = new MockSurfZoneRepository();
    service = new SurfZoneService(repository);
  });

  describe('getSurfZone', () => {
    it('get earth returns zone', async () => {
      const earth = { id: 'earth_id', name: 'earth', zones: [], spots: [] };
      const stub = Sinon.stub(repository, 'getEarthZone').resolves(earth);

      const surfZone = await service.getEarthZone();

      expect(stub.calledOnce).to.equal(true);
      expect(surfZone).to.deep.eq(earth);
    });

    it('get with invalid id returns NOT_FOUND error', async () => {
      const stub = Sinon.stub(repository, 'getSurfZone').resolves(undefined);

      const surfZoneError = await service
        .getSurfZone('invalidKey')
        .catch((err) => err);

      expect(stub.calledOnce).to.equal(true);
      expect(surfZoneError).to.deep.eq({ code: ServiceCodes.NOT_FOUND });
    });

    it('get with valid id returns surfZone', async () => {
      const zoneId = 'valid_id';
      const zone = { id: zoneId, name: '', zones: [], spots: [] };
      const stub = Sinon.stub(repository, 'getSurfZone').resolves(zone);

      const surfZone = await service.getSurfZone(MockData.surfZoneKey);
      expect(stub.calledOnce).to.equal(true);
      expect(surfZone).to.deep.eq(zone);
    });
  });
});
