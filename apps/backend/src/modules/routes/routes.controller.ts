import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RoutesService, RouteQuery } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActorsGuard } from '../../common/guards/actors.guard';
import { Actors } from '../../common/decorators/actors.decorator';
import { ActorType } from '@ve_xe_nhanh_ts/shared-types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrincipalContext } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  private getOperatorId(
    user: PrincipalContext,
    queryOperatorId?: string,
  ): string {
    if (user.actorType === ActorType.OPERATOR) {
      return user.tenantId ?? user.sub;
    }
    if (user.actorType === ActorType.ADMIN && queryOperatorId) {
      return queryOperatorId;
    }
    throw new ForbiddenException('Vui lòng cung cấp operatorId khi là Admin');
  }

  // ===== PUBLIC ENDPOINTS =====
  @Get()
  @ApiOperation({ summary: 'Tìm kiếm tất cả tuyến đường' })
  @ApiQuery({
    name: 'originStopPointId',
    required: false,
    type: String,
    description: 'StopPoint ID bến đi',
  })
  @ApiQuery({
    name: 'destinationStopPointId',
    required: false,
    type: String,
    description: 'StopPoint ID bến đến',
  })
  @ApiQuery({ name: 'operatorId', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(@Query() query: RouteQuery) {
    const data = await this.routesService.findAll(query);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một tuyến đường' })
  async findOne(@Param('id', MongoIdPipe) id: string) {
    const data = await this.routesService.findOne(id);
    return { success: true, data };
  }

  // ===== SECURE ENDPOINTS (Operator / Admin) =====
  @Post()
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Tạo tuyến đường mới' })
  @ApiQuery({
    name: 'operatorId',
    required: false,
    description: 'Chỉ Admin mới cần truyền',
  })
  async create(
    @Body() createDto: CreateRouteDto,
    @CurrentUser() user: PrincipalContext,
    @Query('operatorId') queryOperatorId?: string,
  ) {
    const operatorId = this.getOperatorId(user, queryOperatorId);
    const data = await this.routesService.create(operatorId, createDto);
    return { success: true, data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Cập nhật tuyến đường' })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateRouteDto,
    @CurrentUser() user: PrincipalContext,
  ) {
    const data = await this.routesService.update(
      id,
      user.tenantId ?? user.sub,
      user.actorType,
      updateDto,
    );
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe/Admin] Xóa tuyến đường' })
  async remove(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: PrincipalContext,
  ) {
    await this.routesService.remove(
      id,
      user.tenantId ?? user.sub,
      user.actorType,
    );
    return { success: true, message: 'Đã xóa tuyến đường' };
  }
}
