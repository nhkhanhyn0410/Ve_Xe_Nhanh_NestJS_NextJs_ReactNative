import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StopPoint, StopPointDocument } from './schemas/stop-point.schema';
import { CreateStopPointDto } from './dto/create-stop-point.dto';
import { UpdateStopPointDto } from './dto/update-stop-point.dto';
import { StopPointType, SystemRole } from '@ve_xe_nhanh_ts/shared-types';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

export interface StopPointQuery {
  isActive?: string | boolean;
  city?: string;
  type?: StopPointType;
  search?: string;
}

@Injectable()
export class StopPointsService {
  constructor(
    @InjectModel(StopPoint.name)
    private stopPointModel: Model<StopPointDocument>,
  ) {}

  async create(
    createDto: CreateStopPointDto,
    user?: JwtPayload,
  ): Promise<StopPoint> {
    const data: Partial<StopPoint> = { ...createDto };
    if (user && user.role === SystemRole.OPERATOR) {
      data.operatorId = new Types.ObjectId(user.sub);
    }
    return this.stopPointModel.create(data);
  }

  async findAll(
    query: StopPointQuery = {},
    user?: JwtPayload,
  ): Promise<StopPointDocument[]> {
    const { isActive, city, type, search } = query;

    // Khởi tạo filter với kiểu tường minh để tránh lỗi linter không resolve được FilterQuery
    const filter: {
      isActive?: boolean;
      city?: { $regex: string; $options: string };
      type?: StopPointType;
      $text?: { $search: string };
      $or?: any[];
    } = {};

    if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true' || isActive === true;
    }

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (user && user.role === SystemRole.OPERATOR) {
      filter.$or = [
        { operatorId: { $exists: false } },
        { operatorId: null },
        { operatorId: new Types.ObjectId(user.sub) },
      ];
    }

    const queryFilter = filter as unknown as Parameters<
      Model<StopPointDocument>['find']
    >[0];

    return this.stopPointModel
      .find(queryFilter)
      .sort({ province: 1, city: 1, name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<StopPoint> {
    const stopPoint = await this.stopPointModel.findById(id).exec();
    if (!stopPoint) {
      throw new NotFoundException('Không tìm thấy điểm dừng');
    }
    return stopPoint;
  }

  async update(
    id: string,
    updateDto: UpdateStopPointDto,
    user?: JwtPayload,
  ): Promise<StopPoint> {
    const stopPoint = await this.stopPointModel.findById(id).exec();
    if (!stopPoint) {
      throw new NotFoundException('Không tìm thấy điểm dừng');
    }

    if (user && user.role === SystemRole.OPERATOR) {
      if (String(stopPoint.operatorId) !== user.sub) {
        throw new ForbiddenException('Bạn không có quyền sửa điểm dừng này');
      }
    }

    Object.assign(stopPoint, updateDto);
    return stopPoint.save();
  }

  async remove(id: string, user?: JwtPayload): Promise<void> {
    const stopPoint = await this.stopPointModel.findById(id).exec();
    if (!stopPoint) {
      throw new NotFoundException('Không tìm thấy điểm dừng');
    }

    if (user && user.role === SystemRole.OPERATOR) {
      if (String(stopPoint.operatorId) !== user.sub) {
        throw new ForbiddenException('Bạn không có quyền xóa điểm dừng này');
      }
    }

    await this.stopPointModel.findByIdAndDelete(id).exec();
  }
}
