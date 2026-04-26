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

@ApiTags('Stop Points')
@Controller('stop-points')
export class StopPointsController {
  constructor(private readonly stopPointsService: StopPointsService) {}

  // ===== PUBLIC ENDPOINTS =====
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách điểm dừng toàn quốc' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
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
    const data = await this.stopPointsService.findAll(query);
    return { success: true, data };
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
  @ApiOperation({ summary: '[Admin/Operator] Xóa điểm dừng' })
  async remove(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: PrincipalContext,
  ) {
    await this.stopPointsService.remove(id, user);
    return { success: true, message: 'Đã xóa điểm dừng' };
  }
}
