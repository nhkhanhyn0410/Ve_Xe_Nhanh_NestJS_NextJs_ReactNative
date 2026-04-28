import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ActorType } from '@ve_xe_nhanh_ts/shared-types';
import { Actors } from '@common/decorators/actors.decorator';
import { ActorsGuard } from '@common/guards/actors.guard';
import { MongoIdPipe } from '@common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { WardsService } from './wards.service';

@ApiTags('Wards')
@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách phường/xã' })
  @ApiQuery({ name: 'provinceId', required: false, type: String })
  async findAll(@Query('provinceId') provinceId?: string) {
    const data = await this.wardsService.findAll(provinceId);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết phường/xã' })
  async findOne(@Param('id', MongoIdPipe) id: string) {
    const data = await this.wardsService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Thêm phường/xã mới' })
  async create(@Body() createDto: CreateWardDto) {
    const data = await this.wardsService.create(createDto);
    return { success: true, data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Cập nhật phường/xã' })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateWardDto,
  ) {
    const data = await this.wardsService.update(id, updateDto);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Xóa phường/xã' })
  async remove(@Param('id', MongoIdPipe) id: string) {
    await this.wardsService.remove(id);
    return { success: true, message: 'Đã xóa phường/xã' };
  }
}
