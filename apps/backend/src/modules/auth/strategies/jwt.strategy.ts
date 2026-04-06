import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { OperatorsService } from '../../operators/operators.service';
import { AdminService } from '../../admin/admin.service';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { SystemRole } from '@ve_xe_nhanh_ts/shared-types';

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

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    switch (payload.role) {
      case SystemRole.USER: {
        const user = await this.usersService.findById(payload.sub);
        if (!user || user.isBlocked) {
          throw new UnauthorizedException(
            'Người dùng không tồn tại hoặc đã bị khóa',
          );
        }
        break;
      }
      case SystemRole.OPERATOR: {
        const operator = await this.operatorsService.findById(payload.sub);
        if (!operator) {
          throw new UnauthorizedException('Nhà xe không tồn tại');
        }
        break;
      }
      case SystemRole.ADMIN: {
        const admin = await this.adminService.findById(payload.sub);
        if (!admin || !admin.isActive) {
          throw new UnauthorizedException(
            'Admin không tồn tại hoặc đã bị khóa',
          );
        }
        break;
      }
      default:
        throw new UnauthorizedException('Token không hợp lệ');
    }

    return payload;
  }
}
