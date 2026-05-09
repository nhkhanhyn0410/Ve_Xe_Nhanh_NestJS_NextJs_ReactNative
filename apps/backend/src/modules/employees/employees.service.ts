import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeRole } from '@ve_xe_nhanh_ts/shared-types';
import {
  Operator,
  OperatorDocument,
} from '../operators/schemas/operator.schema';

export interface EmployeeQuery {
  isActive?: string | boolean;
  role?: EmployeeRole;
  search?: string;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<EmployeeDocument>,
    @InjectModel(Operator.name)
    private operatorModel: Model<OperatorDocument>,
  ) {}

  /**
   * Tạo số employeeCode ngẫu nhiên hoặc tuần tự.
   * Để đơn giản, ta tìm số lượng employee hiện trường, rồi +1 và map format 6 chữ số.
   */
  private async generateEmployeeCode(
    operatorId: Types.ObjectId,
  ): Promise<string> {
    const operator = await this.operatorModel.findById(operatorId).exec();
    if (!operator) {
      throw new BadRequestException(
        'Không tìm thấy thông tin nhà xe để tạo mã',
      );
    }

    let prefix = operator.employeeCodePrefix;
    if (!prefix) {
      // Fallback
      prefix = operator.companyName
        .replace(/[^A-Za-z0-9]/g, '')
        .substring(0, 3)
        .toUpperCase();
      if (!prefix) prefix = 'EMP';
    }

    // Đếm số lượng employee hiện tự của nhà xe này
    const count = await this.employeeModel
      .countDocuments({ operatorId })
      .exec();
    let nextCodeInt = count + 1;
    let employeeCode = `${prefix}${String(nextCodeInt).padStart(6, '0')}`;

    // Đảm bảo unique (nếu đã bị trùng, thử tăng lên tiếp)
    let isUnique = false;
    let iterations = 0;
    while (!isUnique && iterations < 10) {
      const exists = await this.employeeModel
        .findOne({ operatorId, employeeCode })
        .exec();
      if (!exists) {
        isUnique = true;
      } else {
        nextCodeInt++;
        employeeCode = `${prefix}${String(nextCodeInt).padStart(6, '0')}`;
      }
      iterations++;
    }

    if (!isUnique) {
      throw new BadRequestException('Không thể tạo mã nhân viên (xung đột)');
    }

    return employeeCode;
  }

  async create(
    operatorId: string,
    createDto: CreateEmployeeDto,
  ): Promise<Employee> {
    const opId = new Types.ObjectId(operatorId);

    // Auto-generate employee code
    const employeeCode = await this.generateEmployeeCode(opId);

    const data = {
      ...createDto,
      operatorId: opId,
      employeeCode,
    };

    return this.employeeModel.create(data);
  }

  async findAll(
    operatorId: string,
    query: EmployeeQuery = {},
  ): Promise<EmployeeDocument[]> {
    const { isActive, role, search } = query;
    const filter: Record<string, unknown> = {
      operatorId: new Types.ObjectId(operatorId),
    };

    if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true' || isActive === true;
    }

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } },
      ];
    }

    return this.employeeModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, operatorId: string): Promise<Employee> {
    const employee = await this.employeeModel
      .findOne({ _id: id, operatorId: new Types.ObjectId(operatorId) })
      .exec();

    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }
    return employee;
  }

  async update(
    id: string,
    operatorId: string,
    updateDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.employeeModel
      .findOneAndUpdate(
        { _id: id, operatorId: new Types.ObjectId(operatorId) },
        updateDto,
        { new: true },
      )
      .exec();

    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }
    return employee;
  }

  async remove(id: string, operatorId: string): Promise<void> {
    // Soft delete
    const employee = await this.employeeModel
      .findOneAndUpdate(
        { _id: id, operatorId: new Types.ObjectId(operatorId) },
        { isActive: false, resignedDate: new Date() },
      )
      .exec();

    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }
  }
}
