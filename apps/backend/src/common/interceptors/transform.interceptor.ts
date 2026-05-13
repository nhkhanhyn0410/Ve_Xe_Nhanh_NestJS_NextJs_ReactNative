import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RequestWithContext } from '../interfaces/request-context.interface';

export interface TransformedResponse<T> {
  success: true;
  data: T;
  requestId?: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  unknown,
  TransformedResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<TransformedResponse<T>> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const requestId = request.requestContext?.requestId;

    return next.handle().pipe(
      map((data: unknown) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...(data as TransformedResponse<T>),
            ...(requestId ? { requestId } : {}),
          };
        }
        return {
          success: true as const,
          data: data as T,
          ...(requestId ? { requestId } : {}),
        };
      }),
    );
  }
}
