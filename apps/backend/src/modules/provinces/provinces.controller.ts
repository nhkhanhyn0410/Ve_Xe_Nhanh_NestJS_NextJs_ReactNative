import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { ProvincesService } from './provinces.service';
import { MongoIdPipe } from '@common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { SystemRole } from '@ve_xe_nhanh_ts/shared-types';

@ApiTags('Provinces')
@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tỉnh/thành phố' })
  async findAll() {
    const data = await this.provincesService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết tỉnh/thành phố' })
  async findOne(@Param('id', MongoIdPipe) id: string) {
    const data = await this.provincesService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Thêm tỉnh/thành phố mới' })
  async create(@Body() createDto: CreateProvinceDto) {
    const data = await this.provincesService.create(createDto);
    return { success: true, data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Cập nhật tỉnh/thành phố' })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateProvinceDto,
  ) {
    const data = await this.provincesService.update(id, updateDto);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Xóa tỉnh/thành phố' })
  async remove(@Param('id', MongoIdPipe) id: string) {
    await this.provincesService.remove(id);
    return { success: true, message: 'Đã xóa tỉnh/thành phố' };
  }
}
