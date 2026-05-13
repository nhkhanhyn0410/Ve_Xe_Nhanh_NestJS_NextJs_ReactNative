import { Request } from 'express';

export interface RequestContext {
  readonly requestId: string;
  readonly method: string;
  readonly path: string;
  readonly receivedAt: string;
  readonly idempotencyKey?: string;
}

export type RequestWithContext = Request & {
  requestContext?: RequestContext;
};
