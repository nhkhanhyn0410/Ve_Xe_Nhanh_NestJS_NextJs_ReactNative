import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import {
  PrincipalContext,
  PrincipalRole,
} from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<PrincipalRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // No @Roles() decorator found, so allow access
    }
    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: PrincipalContext }>();
    if (!user) {
      return false;
    }
    return !!user.role && requiredRoles.includes(user.role);
  }
}
