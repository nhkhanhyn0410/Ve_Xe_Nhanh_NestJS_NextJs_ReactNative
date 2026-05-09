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
  DefaultValuePipe,
  ParseFloatPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { StopPointsService, StopPointQuery } from './stop-points.service';
import { CreateStopPointDto } from './dto/create-stop-point.dto';
import { UpdateStopPointDto } from './dto/update-stop-point.dto';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActorsGuard } from '../../common/guards/actors.guard';
import { Actors } from '../../common/decorators/actors.decorator';
import { ActorType, StopPointType } from '@ve_xe_nhanh_ts/shared-types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrincipalContext } from '../../common/interfaces/jwt-payload.interface';

type NearbyStopPointsResponse = {
  success: true;
  data: Awaited<ReturnType<StopPointsService['findNearby']>>;
};

@ApiTags('Stop Points')
@Controller('stop-points')
export class StopPointsController {
  constructor(private readonly stopPointsService: StopPointsService) {}

  // ===== PUBLIC ENDPOINTS =====
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách điểm dừng toàn quốc' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'provinceName', 'wardName', 'createdAt'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'provinceName', required: false, type: String })
  @ApiQuery({ name: 'wardName', required: false, type: String })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: StopPointType,
    enumName: 'StopPointType',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@Query() query: StopPointQuery) {
    const result = await this.stopPointsService.findAll(query);
    return { success: true, ...result };
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Tìm điểm dừng gần tọa độ GPS' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radiusKm', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: StopPointType,
    enumName: 'StopPointType',
  })
  async findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radiusKm', new DefaultValuePipe(10), ParseFloatPipe)
    radiusKm: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('type') type?: StopPointType,
  ): Promise<NearbyStopPointsResponse> {
    return {
      success: true,
      data: await this.stopPointsService.findNearby({
        lat,
        lng,
        radiusKm,
        limit,
        type,
      }),
    };
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      '[Operator] Lấy điểm dừng công khai và điểm dừng của nhà xe hiện tại',
  })
  async findMine(
    @Query() query: StopPointQuery,
    @CurrentUser() user: PrincipalContext,
  ) {
    const result = await this.stopPointsService.findAll(query, user);
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một điểm dừng' })
  async findOne(@Param('id', MongoIdPipe) id: string) {
    const data = await this.stopPointsService.findOne(id);
    return { success: true, data };
  }

  // ===== ADMIN ENDPOINTS =====
  @Post()
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN, ActorType.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin/Operator] Thêm điểm dừng mới' })
  async create(
    @Body() createDto: CreateStopPointDto,
    @CurrentUser() user: PrincipalContext,
  ) {
    const data = await this.stopPointsService.create(createDto, user);
    return { success: true, data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN, ActorType.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin/Operator] Cập nhật điểm dừng' })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateStopPointDto,
    @CurrentUser() user: PrincipalContext,
  ) {
    const data = await this.stopPointsService.update(id, updateDto, user);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN, ActorType.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin/Operator] Ngừng kích hoạt điểm dừng' })
  async remove(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: PrincipalContext,
  ) {
    await this.stopPointsService.remove(id, user);
    return { success: true, message: 'Đã ngừng kích hoạt điểm dừng' };
  }
}
