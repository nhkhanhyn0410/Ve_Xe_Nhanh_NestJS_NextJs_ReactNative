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
import { EmployeesService, EmployeeQuery } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { MongoIdPipe } from '../../common/pipes/mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActorsGuard } from '../../common/guards/actors.guard';
import { Actors } from '../../common/decorators/actors.decorator';
import { ActorType, EmployeeRole } from '@ve_xe_nhanh_ts/shared-types';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrincipalContext } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, ActorsGuard)
@ApiBearerAuth()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  private extractOperatorId(
    user: PrincipalContext,
    queryOperatorId?: string,
  ): string {
    if (user.actorType === ActorType.OPERATOR) {
      return user.tenantId ?? user.sub;
    }
    // Nếu là Admin, phải cung cấp queryOperatorId để biết đang quản lý NV cho nhà xe nào
    if (user.actorType === ActorType.ADMIN && queryOperatorId) {
      return queryOperatorId;
    }
    throw new ForbiddenException('Vui lòng cung cấp operatorId (nếu là Admin)');
  }

  @Post()
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiOperation({ summary: 'Thêm nhân viên mới' })
  @ApiQuery({
    name: 'operatorId',
    required: false,
    description: 'Chỉ Admin mới cần truyền',
  })
  async create(
    @Body() createDto: CreateEmployeeDto,
    @CurrentUser() user: PrincipalContext,
    @Query('operatorId') queryOperatorId?: string,
  ) {
    const operatorId = this.extractOperatorId(user, queryOperatorId);
    const data = await this.employeesService.create(operatorId, createDto);
    return { success: true, data };
  }

  @Get()
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách nhân viên của nhà xe' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: EmployeeRole,
    enumName: 'EmployeeRole',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'operatorId',
    required: false,
    description: 'Chỉ Admin mới cần truyền',
  })
  async findAll(
    @Query() query: EmployeeQuery,
    @CurrentUser() user: PrincipalContext,
    @Query('operatorId') queryOperatorId?: string,
  ) {
    const operatorId = this.extractOperatorId(user, queryOperatorId);
    const data = await this.employeesService.findAll(operatorId, query);
    return { success: true, data };
  }

  @Get(':id')
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiOperation({ summary: 'Xem chi tiết nhân viên' })
  @ApiQuery({
    name: 'operatorId',
    required: false,
    description: 'Chỉ Admin mới cần truyền',
  })
  async findOne(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: PrincipalContext,
    @Query('operatorId') queryOperatorId?: string,
  ) {
    const operatorId = this.extractOperatorId(user, queryOperatorId);
    const data = await this.employeesService.findOne(id, operatorId);
    return { success: true, data };
  }

  @Put(':id')
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin nhân viên' })
  @ApiQuery({
    name: 'operatorId',
    required: false,
    description: 'Chỉ Admin mới cần truyền',
  })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateDto: UpdateEmployeeDto,
    @CurrentUser() user: PrincipalContext,
    @Query('operatorId') queryOperatorId?: string,
  ) {
    const operatorId = this.extractOperatorId(user, queryOperatorId);
    const data = await this.employeesService.update(id, operatorId, updateDto);
    return { success: true, data };
  }

  @Delete(':id')
  @Actors(ActorType.OPERATOR, ActorType.ADMIN)
  @ApiOperation({ summary: 'Xóa nhân viên (Soft delete)' })
  @ApiQuery({
    name: 'operatorId',
    required: false,
    description: 'Chỉ Admin mới cần truyền',
  })
  async remove(
    @Param('id', MongoIdPipe) id: string,
    @CurrentUser() user: PrincipalContext,
    @Query('operatorId') queryOperatorId?: string,
  ) {
    const operatorId = this.extractOperatorId(user, queryOperatorId);
    await this.employeesService.remove(id, operatorId);
    return { success: true, message: 'Đã xóa nhân viên' };
  }
}
