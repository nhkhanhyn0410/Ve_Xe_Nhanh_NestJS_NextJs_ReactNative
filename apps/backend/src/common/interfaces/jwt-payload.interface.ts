import {
  ActorType,
  AdminRole,
  EmployeeRole,
  UserRole,
} from '@ve_xe_nhanh_ts/shared-types';

export type PrincipalRole = AdminRole | EmployeeRole | UserRole;

export interface JwtPayload {
  sub: string;
  actorType: ActorType;
  email?: string;
  role?: PrincipalRole;
  tenantId?: string;
  iat?: number;
  exp?: number;
}

export interface PrincipalContext extends JwtPayload {
  actorId: string;
}
