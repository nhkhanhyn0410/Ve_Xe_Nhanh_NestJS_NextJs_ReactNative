import { PrincipalContext } from '@common/interfaces/jwt-payload.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: keyof PrincipalContext | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: PrincipalContext }>();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
