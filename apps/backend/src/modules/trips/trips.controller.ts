import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
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
import { TripQuery, TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AssignBusDto, AssignCrewDto } from './dto/assign-resource.dto';
import { TripMapper } from './mappers/trip.mapper';
import { MongoIdPipe } from '@common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActorsGuard } from '@common/guards/actors.guard';
import { Actors } from '@common/decorators/actors.decorator';
import { ActorType, TripStatus } from '@ve_xe_nhanh_ts/shared-types';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { PrincipalContext } from '@common/interfaces/jwt-payload.interface';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

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

  // ─── CRUD ─────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách chuyến xe' })
  @ApiQuery({ name: 'operatorId', required: false })
  @ApiQuery({ name: 'routeId', required: false })
  @ApiQuery({ name: 'busId', required: false })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TripStatus,
    enumName: 'TripStatus',
  })
  async findAll(@Query() query: TripQuery) {
    const docs = await this.tripsService.findAll(query);
    return docs.map((doc) => TripMapper.toList(doc));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết chuyến xe (sơ đồ ghế)' })
  async findOne(@Param('id', MongoIdPipe) id: string) {
    const doc = await this.tripsService.findOne(id);
    return TripMapper.toDetail(doc);
  }

  @Post()
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Nhà Xe] Tạo chuyến xe (DRAFT nếu chưa gắn xe)',
  })
  @ApiQuery({
    name: 'operatorId',
    required: false,
    description: 'Chỉ Admin mới cần truyền',
  })
  async create(
    @Body() createDto: CreateTripDto,
    @CurrentUser() user: PrincipalContext,
    @Query('operatorId') queryOperatorId?: string,
  ) {
    const operatorId = this.getOperatorId(user, queryOperatorId);
    const doc = await this.tripsService.create(operatorId, createDto);
    return TripMapper.toList(doc);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Cập nhật thông tin chuyến xe' })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateTripDto,
    @CurrentUser() user: PrincipalContext,
  ) {
    const doc = await this.tripsService.update(
      id,
      user.tenantId ?? user.sub,
      user.actorType,
      updateDto,
    );
    return TripMapper.toList(doc);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Xóa chuyến xe' })
  async remove(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: PrincipalContext,
  ) {
    await this.tripsService.remove(
      id,
      user.tenantId ?? user.sub,
      user.actorType,
    );
    return { message: 'Đã xóa chuyến xe thành công' };
  }

  // ─── Phân công ────────────────────────────────────────────────────

  @Patch(':id/assign-bus')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Nhà Xe] Gắn xe vào chuyến (DRAFT → SCHEDULED)',
  })
  async assignBus(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: AssignBusDto,
    @CurrentUser() user: PrincipalContext,
  ) {
    const doc = await this.tripsService.assignBus(
      id,
      user.tenantId ?? user.sub,
      user.actorType,
      dto,
    );
    return TripMapper.toDetail(doc);
  }

  @Patch(':id/unassign-bus')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Nhà Xe] Bỏ gắn xe (SCHEDULED → DRAFT)',
  })
  async unassignBus(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: PrincipalContext,
  ) {
    const doc = await this.tripsService.unassignBus(
      id,
      user.tenantId ?? user.sub,
      user.actorType,
    );
    return TripMapper.toList(doc);
  }

  @Patch(':id/assign-crew')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Phân công nhân viên cho chuyến' })
  async assignCrew(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: AssignCrewDto,
    @CurrentUser() user: PrincipalContext,
  ) {
    const doc = await this.tripsService.assignCrew(
      id,
      user.tenantId ?? user.sub,
      user.actorType,
      dto,
    );
    return TripMapper.toList(doc);
  }
}
