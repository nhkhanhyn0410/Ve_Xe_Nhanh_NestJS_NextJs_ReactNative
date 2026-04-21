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
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { SystemRole, TripStatus } from '@ve_xe_nhanh_ts/shared-types';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces/jwt-payload.interface';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.OPERATOR, SystemRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Nhà Xe] Tạo chuyến xe (DRAFT nếu chưa gắn xe)',
  })
  async create(
    @Body() createDto: CreateTripDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const doc = await this.tripsService.create(user.sub, createDto);
    return TripMapper.toList(doc);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.OPERATOR, SystemRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Cập nhật thông tin chuyến xe' })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateTripDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const doc = await this.tripsService.update(
      id,
      user.sub,
      user.role,
      updateDto,
    );
    return TripMapper.toList(doc);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.OPERATOR, SystemRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Xóa chuyến xe' })
  async remove(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.tripsService.remove(id, user.sub, user.role);
    return { message: 'Đã xóa chuyến xe thành công' };
  }

  // ─── Phân công ────────────────────────────────────────────────────

  @Patch(':id/assign-bus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.OPERATOR, SystemRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Nhà Xe] Gắn xe vào chuyến (DRAFT → SCHEDULED)',
  })
  async assignBus(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: AssignBusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const doc = await this.tripsService.assignBus(id, user.sub, user.role, dto);
    return TripMapper.toDetail(doc);
  }

  @Patch(':id/unassign-bus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.OPERATOR, SystemRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '[Nhà Xe] Bỏ gắn xe (SCHEDULED → DRAFT)',
  })
  async unassignBus(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const doc = await this.tripsService.unassignBus(id, user.sub, user.role);
    return TripMapper.toList(doc);
  }

  @Patch(':id/assign-crew')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.OPERATOR, SystemRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Nhà Xe] Phân công nhân viên cho chuyến' })
  async assignCrew(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: AssignCrewDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const doc = await this.tripsService.assignCrew(
      id,
      user.sub,
      user.role,
      dto,
    );
    return TripMapper.toList(doc);
  }
}
