import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestWithContext } from '../interfaces/request-context.interface';

const REQUEST_ID_HEADER = 'x-request-id';
const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: RequestWithContext, res: Response, next: NextFunction): void {
    const requestId =
      readHeader(req.headers[REQUEST_ID_HEADER]) ?? randomUUID();
    const idempotencyKey = readHeader(req.headers[IDEMPOTENCY_KEY_HEADER]);

    req.requestContext = {
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      receivedAt: new Date().toISOString(),
      ...(idempotencyKey ? { idempotencyKey } : {}),
    };

    res.setHeader('X-Request-Id', requestId);
    next();
  }
}

function readHeader(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined;
  }

  return value?.trim() || undefined;
}
