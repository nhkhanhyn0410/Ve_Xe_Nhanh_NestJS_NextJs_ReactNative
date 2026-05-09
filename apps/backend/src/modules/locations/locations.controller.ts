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
import { CreateProvinceDto } from './dto/create-province.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { LocationsService } from './locations.service';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('provinces')
  @ApiOperation({ summary: 'Lấy danh sách tỉnh/thành phố' })
  async findAllProvinces() {
    const data = await this.locationsService.findAllProvinces();
    return { success: true, data };
  }

  @Get('provinces/:id')
  @ApiOperation({ summary: 'Xem chi tiết tỉnh/thành phố' })
  async findOneProvince(@Param('id', MongoIdPipe) id: string) {
    const data = await this.locationsService.findOneProvince(id);
    return { success: true, data };
  }

  @Post('provinces')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Thêm tỉnh/thành phố' })
  async createProvince(@Body() createDto: CreateProvinceDto) {
    const data = await this.locationsService.createProvince(createDto);
    return { success: true, data };
  }

  @Put('provinces/:id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Cập nhật tỉnh/thành phố' })
  async updateProvince(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateProvinceDto,
  ) {
    const data = await this.locationsService.updateProvince(id, updateDto);
    return { success: true, data };
  }

  @Delete('provinces/:id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Xóa tỉnh/thành phố' })
  async removeProvince(@Param('id', MongoIdPipe) id: string) {
    await this.locationsService.removeProvince(id);
    return { success: true, message: 'Đã xóa tỉnh/thành phố' };
  }

  @Get('wards')
  @ApiOperation({ summary: 'Lấy danh sách phường/xã' })
  @ApiQuery({ name: 'provinceId', required: false, type: String })
  @ApiQuery({ name: 'provinceCode', required: false, type: String })
  async findAllWards(
    @Query('provinceId') provinceId?: string,
    @Query('provinceCode') provinceCode?: string,
  ) {
    const data = await this.locationsService.findAllWards(
      provinceId,
      provinceCode,
    );
    return { success: true, data };
  }

  @Get('wards/:id')
  @ApiOperation({ summary: 'Xem chi tiết phường/xã' })
  async findOneWard(@Param('id', MongoIdPipe) id: string) {
    const data = await this.locationsService.findOneWard(id);
    return { success: true, data };
  }

  @Post('wards')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Thêm phường/xã' })
  async createWard(@Body() createDto: CreateWardDto) {
    const data = await this.locationsService.createWard(createDto);
    return { success: true, data };
  }

  @Put('wards/:id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Cập nhật phường/xã' })
  async updateWard(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateWardDto,
  ) {
    const data = await this.locationsService.updateWard(id, updateDto);
    return { success: true, data };
  }

  @Delete('wards/:id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Xóa phường/xã' })
  async removeWard(@Param('id', MongoIdPipe) id: string) {
    await this.locationsService.removeWard(id);
    return { success: true, message: 'Đã xóa phường/xã' };
  }
}
