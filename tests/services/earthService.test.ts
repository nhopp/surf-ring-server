import { expect } from 'chai';
import * as Sinon from 'sinon';

import { ContextImp } from '../../src/common/context';
import { EarthRepository } from '../../src/respository/earthRepository';
import { EarthService } from '../../src/services/earthService';
import { ServiceCode } from '../../src/services/serviceCodes';
import { MockEarthRepository } from '../mocks/mockEarthRepository';
import { MockLogger } from '../mocks/mockLogger';
import { RepositoryCode } from '../repositories/repositoryCodes';

describe('EarthService', () => {
  const ctx = new ContextImp(new MockLogger());
  let repository: EarthRepository;
  let service: EarthService;

  beforeEach(() => {
    repository = new MockEarthRepository();
    service = new EarthService(repository);
  });

  describe('getEarth', () => {
    it('happyPath', async () => {
      const earth = { id: 'earth_id', name: 'earth', zones: [], spots: [] };
      const stub = Sinon.stub(repository, 'getEarth').resolves(earth);

      const surfZone = await service.getEarth(ctx);

      expect(stub.calledOnce).to.equal(true);
      expect(surfZone).to.deep.eq(earth);
    });

    it('no earth rejects NOT_FOUND', async () => {
      const stub = Sinon.stub(repository, 'getEarth').rejects({
        code: RepositoryCode.NOT_FOUND
      });

      const error = await service.getEarth(ctx).catch((err) => err);

      expect(stub.calledOnce).to.equal(true);
      expect(error).to.deep.eq({ code: ServiceCode.NOT_FOUND });
    });
  });

  describe('addEarth', () => {
    it('happyPath', async () => {
      const earth = { id: 'id', name: 'earth', zones: [], spots: [] };
      const stub = Sinon.stub(repository, 'addEarth').resolves(earth);

      const addedEarth = await service.addEarth(ctx, earth);

      expect(stub.calledOnce).to.equal(true);
      expect(addedEarth).to.deep.eq(earth);
    });

    it('double addEarth rejects BAD_REQUEST', async () => {
      const earth = { id: 'id', name: 'earth', zones: [], spots: [] };
      const stub = Sinon.stub(repository, 'addEarth').resolves(earth);

      await service.addEarth(ctx, earth);
      const error = await service.addEarth(ctx, earth).catch((err) => err);

      expect(stub.calledTwice).to.equal(true);
      expect(error).to.deep.eq({ code: ServiceCode.BAD_REQUEST });
    });
  });
});
