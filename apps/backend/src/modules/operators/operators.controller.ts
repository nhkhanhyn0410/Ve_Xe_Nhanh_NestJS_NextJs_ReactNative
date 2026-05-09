import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ActorType, OperatorStatus } from '@ve_xe_nhanh_ts/shared-types';
import { OperatorsService } from './operators.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { UpdateBankInfoDto } from './dto/update-bank-info.dto';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActorsGuard } from '../../common/guards/actors.guard';
import { Actors } from '../../common/decorators/actors.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrincipalContext } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Operators')
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  private assertOperatorAccess(id: string, user: PrincipalContext): void {
    if (user.actorType === ActorType.ADMIN) {
      return;
    }
    const operatorId = user.tenantId ?? user.sub;
    if (operatorId !== id) {
      throw new ForbiddenException('Bạn không có quyền thao tác nhà xe này');
    }
  }

  // ===== PUBLIC ENDPOINTS =====

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký nhà xe mới' })
  async register(@Body() createOperatorDto: CreateOperatorDto) {
    const operator = await this.operatorsService.create(createOperatorDto);
    return {
      success: true,
      data: operator,
      message: 'Đăng ký nhà xe thành công, vui lòng chờ admin duyệt.',
    };
  }

  // ===== OPERATOR ENDPOINTS (can auth sau nay) =====

  @Get()
  @ApiOperation({ summary: 'Danh sách nhà xe' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OperatorStatus,
    enumName: 'OperatorStatus',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: OperatorStatus,
    @Query('search') search?: string,
  ) {
    const result = await this.operatorsService.findAll({
      page,
      limit,
      status,
      search,
    });
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết nhà xe' })
  async findOne(@Param('id', MongoIdPipe) id: string) {
    const operator = await this.operatorsService.findById(id);
    return { success: true, data: operator };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin nhà xe' })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: UpdateOperatorDto,
    @CurrentUser() user: PrincipalContext,
  ) {
    this.assertOperatorAccess(id, user);
    const operator = await this.operatorsService.update(id, dto);
    return { success: true, data: operator };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa nhà xe' })
  async remove(@Param('id', MongoIdPipe) id: string) {
    await this.operatorsService.remove(id);
    return { success: true, message: 'Xóa nhà xe thành công' };
  }

  // ===== ADMIN ENDPOINTS (Da khao bao bao mat) =====

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Duyệt nhà xe' })
  async approve(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() admin: PrincipalContext,
  ) {
    const operator = await this.operatorsService.approve(id, admin.sub);
    return { success: true, data: operator };
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Từ chối nhà xe' })
  async reject(
    @Param('id', MongoIdPipe) id: string,
    @Body('reason') reason: string,
  ) {
    const operator = await this.operatorsService.reject(id, reason);
    return { success: true, data: operator };
  }

  @Post(':id/suspend')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Tạm ngưng nhà xe' })
  async suspend(
    @Param('id', MongoIdPipe) id: string,
    @Body('reason') reason: string,
  ) {
    const operator = await this.operatorsService.suspend(id, reason);
    return { success: true, data: operator };
  }

  @Post(':id/resume')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Mở lại nhà xe' })
  async resume(@Param('id', MongoIdPipe) id: string) {
    const operator = await this.operatorsService.resume(id);
    return { success: true, data: operator };
  }

  // ===== BANK INFO =====

  @Put(':id/bank-info')
  @UseGuards(JwtAuthGuard, ActorsGuard)
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin ngân hàng' })
  async updateBankInfo(
    @Param('id', MongoIdPipe) id: string,
    @Body() dto: UpdateBankInfoDto,
    @CurrentUser() user: PrincipalContext,
  ) {
    this.assertOperatorAccess(id, user);
    const operator = await this.operatorsService.updateBankInfo(id, dto);
    return { success: true, data: operator };
  }
}
