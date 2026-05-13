import { describe, expect, it, jest } from '@jest/globals';
import { Response } from 'express';
import { RequestWithContext } from '../interfaces/request-context.interface';
import { RequestContextMiddleware } from './request-context.middleware';

describe('RequestContextMiddleware', () => {
  it('uses inbound request id and exposes it in response header', () => {
    const middleware = new RequestContextMiddleware();
    const req = createRequest({
      'x-request-id': 'req-123',
      'idempotency-key': 'idem-123',
    });
    const { response, setHeader } = createResponse();
    const next = jest.fn();

    middleware.use(req, response, next);

    expect(req.requestContext).toEqual({
      requestId: 'req-123',
      method: 'POST',
      path: '/api/v1/bookings',
      receivedAt: expect.any(String),
      idempotencyKey: 'idem-123',
    });
    expect(setHeader).toHaveBeenCalledWith('X-Request-Id', 'req-123');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('generates request id when missing', () => {
    const middleware = new RequestContextMiddleware();
    const req = createRequest({});
    const { response, setHeader } = createResponse();

    middleware.use(req, response, jest.fn());

    const requestId = req.requestContext?.requestId;
    expect(requestId).toEqual(expect.any(String));
    if (!requestId) {
      throw new Error('Expected generated requestId');
    }
    expect(setHeader).toHaveBeenCalledWith('X-Request-Id', requestId);
  });
});

function createRequest(
  headers: Record<string, string | string[] | undefined>,
): RequestWithContext {
  return {
    method: 'POST',
    originalUrl: '/api/v1/bookings',
    url: '/bookings',
    headers,
  } as RequestWithContext;
}

function createResponse() {
  const setHeader = jest.fn();
  const response = {
    setHeader,
  } as unknown as Response;

  return {
    response,
    setHeader,
  };
}
