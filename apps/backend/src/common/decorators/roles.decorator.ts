import { SetMetadata } from '@nestjs/common';
import { PrincipalRole } from '../interfaces/jwt-payload.interface';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: PrincipalRole[]) =>
  SetMetadata(ROLES_KEY, roles);
