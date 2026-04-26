import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ActorType } from '@ve_xe_nhanh_ts/shared-types';
import { ACTORS_KEY } from '../constants';
import { PrincipalContext } from '../interfaces/jwt-payload.interface';

@Injectable()
export class ActorsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedActors = this.reflector.getAllAndOverride<ActorType[]>(
      ACTORS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!allowedActors) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: PrincipalContext }>();

    return !!user && allowedActors.includes(user.actorType);
  }
}
