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
import { BusesService, BusQuery } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { MongoIdPipe } from '@common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActorsGuard } from '@common/guards/actors.guard';
import { Actors } from '@common/decorators/actors.decorator';
import { ActorType, BusType, BusStatus } from '@ve_xe_nhanh_ts/shared-types';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { PrincipalContext } from '@common/interfaces/jwt-payload.interface';

@ApiTags('Buses')
@Controller('buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

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

  @Get()
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe / Admin] Lấy danh sách xe' })
  @ApiQuery({
    name: 'operatorId',
    required: false,
    type: String,
    description: 'Admin: lọc theo nhà xe. Operator: tự động gắn từ JWT',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: BusStatus,
    enumName: 'BusStatus',
  })
  @ApiQuery({
    name: 'busType',
    required: false,
    enum: BusType,
    enumName: 'BusType',
  })
  @ApiQuery({ name: 'busNumber', required: false, type: String })
  async findAll(
    @Query() query: BusQuery,
    @CurrentUser() user: PrincipalContext,
  ) {
    // OPERATOR: chỉ thấy xe của mình, bỏ qua query.operatorId
    if (user.actorType === ActorType.OPERATOR) {
      query.operatorId = user.tenantId ?? user.sub;
    }
    // ADMIN: dùng query.operatorId để lọc, hoặc bỏ trống để xem tất cả

    const data = await this.busesService.findAll(query);
    return { success: true, data };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe / Admin] Xem chi tiết một con xe' })
  async findOne(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: PrincipalContext,
  ) {
    // OPERATOR: chỉ xem xe của mình, ADMIN: xem bất kỳ
    const operatorId =
      user.actorType === ActorType.OPERATOR
        ? (user.tenantId ?? user.sub)
        : undefined;
    const data = await this.busesService.findOne(id, operatorId);
    return { success: true, data };
  }

  @Post()
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Thêm mới một chiếc xe' })
  @ApiQuery({
    name: 'operatorId',
    required: false,
    description: 'Chỉ Admin mới cần truyền',
  })
  async create(
    @Body() createDto: CreateBusDto,
    @CurrentUser() user: PrincipalContext,
    @Query('operatorId') queryOperatorId?: string,
  ) {
    const operatorId = this.getOperatorId(user, queryOperatorId);
    const data = await this.busesService.create(operatorId, createDto);
    return { success: true, data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Cập nhật thông tin/sơ đồ ghế của xe' })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateBusDto,
    @CurrentUser() user: PrincipalContext,
  ) {
    const data = await this.busesService.update(
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
  @ApiOperation({ summary: '[Nhà Xe] Xóa / Hủy xe' })
  async remove(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: PrincipalContext,
  ) {
    await this.busesService.remove(
      id,
      user.tenantId ?? user.sub,
      user.actorType,
    );
    return { success: true, message: 'Đã xóa xe thành công' };
  }
}
