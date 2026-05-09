import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { OperatorsService } from '../../operators/operators.service';
import { AdminService } from '../../admin/admin.service';
import {
  JwtPayload,
  PrincipalContext,
} from '../../../common/interfaces/jwt-payload.interface';
import {
  ActorType,
  OperatorStatus,
  UserRole,
} from '@ve_xe_nhanh_ts/shared-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
    private operatorsService: OperatorsService,
    private adminService: AdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<PrincipalContext> {
    switch (payload.actorType) {
      case ActorType.USER: {
        const user = await this.usersService.findById(payload.sub);
        if (!user || user.isBlocked) {
          throw new UnauthorizedException(
            'Người dùng không tồn tại hoặc đã bị khóa',
          );
        }
        return {
          ...payload,
          actorId: payload.sub,
          role: user.role ?? UserRole.CUSTOMER,
        };
      }
      case ActorType.OPERATOR: {
        const operator = await this.operatorsService.findById(payload.sub);
        if (!operator || operator.status !== OperatorStatus.APPROVED) {
          throw new UnauthorizedException(
            'Nhà xe không tồn tại hoặc không còn hoạt động',
          );
        }
        return {
          ...payload,
          actorId: payload.sub,
          tenantId: payload.tenantId ?? payload.sub,
        };
      }
      case ActorType.ADMIN: {
        const admin = await this.adminService.findById(payload.sub);
        if (!admin || !admin.isActive) {
          throw new UnauthorizedException(
            'Admin không tồn tại hoặc đã bị khóa',
          );
        }
        return {
          ...payload,
          actorId: payload.sub,
          role: admin.adminRole,
        };
      }
      case ActorType.EMPLOYEE: {
        throw new UnauthorizedException(
          'Xác thực nhân viên chưa được triển khai',
        );
      }
      default:
        throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
