import * as chai from 'chai';
import * as HttpStatus from 'http-status-codes';
import { createRequest, createResponse } from 'node-mocks-http';
import * as sinon from 'sinon';

import { ContextImp } from '../../src/common/context';
import { AdminAuthorizer } from '../../src/middleware/adminAuthorizer';
import { MockLogger } from '../mocks/mockLogger';

describe('AdminAuthorizer', () => {
  const expect = chai.expect;
  const ctx = new ContextImp(new MockLogger());
  const token = 'auth-token';
  describe('middleware()', () => {
    it('missing Authoziration token : 401 Unauthorized', () => {
      const nextSpy = sinon.spy();
      const req = createRequest();
      const res = createResponse();

      const adminAuthorizer = new AdminAuthorizer(token);
      adminAuthorizer.middleware(req, res, nextSpy);
      expect(res.statusCode).to.be.eq(HttpStatus.UNAUTHORIZED);
    });

    it('invalid bearer token : 401 unauthorized', () => {
      const nextSpy = sinon.spy();
      const req = createRequest();
      req.headers.authorization = 'Bearer notRight';
      const res = createResponse();

      const adminAuthorizer = new AdminAuthorizer(token);
      adminAuthorizer.middleware(req, res, nextSpy);
      expect(res.statusCode).to.be.eq(HttpStatus.UNAUTHORIZED);
    });

    it('missing authorization header : 401 unauthorized', () => {
      const nextSpy = sinon.spy();
      const req = createRequest();
      req.headers.authorization = 'Bearer notRight';
      const res = createResponse();

      const adminAuthorizer = new AdminAuthorizer(token);
      adminAuthorizer.middleware(req, res, nextSpy);
      expect(res.statusCode).to.be.eq(HttpStatus.UNAUTHORIZED);
    });

    it('valid autho token calls next() once', () => {
      const nextSpy = sinon.spy();
      const req = createRequest();
      req.headers.authorization = `Bearer ${token}`;
      const res = createResponse();

      const adminAuthorizer = new AdminAuthorizer(token);
      adminAuthorizer.middleware(req, res, nextSpy);
      expect(res.statusCode).to.be.eq(HttpStatus.OK);
      expect(nextSpy.calledOnce).to.eq(true);
    });
  });
});
