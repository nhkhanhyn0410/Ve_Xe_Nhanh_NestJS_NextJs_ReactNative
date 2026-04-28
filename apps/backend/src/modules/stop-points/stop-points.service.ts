import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StopPoint, StopPointDocument } from './schemas/stop-point.schema';
import {
  Province,
  ProvinceDocument,
} from '../provinces/schemas/province.schema';
import { Ward, WardDocument } from '../wards/schemas/ward.schema';
import { CreateStopPointDto } from './dto/create-stop-point.dto';
import { UpdateStopPointDto } from './dto/update-stop-point.dto';
import { ActorType, StopPointType } from '@ve_xe_nhanh_ts/shared-types';
import { PrincipalContext } from '../../common/interfaces/jwt-payload.interface';

export interface StopPointQuery {
  isActive?: string | boolean;
  wardName?: string;
  provinceName?: string;
  type?: StopPointType;
  search?: string;
}

@Injectable()
export class StopPointsService {
  constructor(
    @InjectModel(StopPoint.name)
    private stopPointModel: Model<StopPointDocument>,
    @InjectModel(Province.name)
    private provinceModel: Model<ProvinceDocument>,
    @InjectModel(Ward.name)
    private wardModel: Model<WardDocument>,
  ) {}

  async create(
    createDto: CreateStopPointDto,
    user?: PrincipalContext,
  ): Promise<StopPoint> {
    const { provinceId, wardId, ...restDto } = createDto;
    const adminData = await this.validateAndResolveProvinceWard(
      provinceId,
      wardId,
    );
    const data: Partial<StopPoint> = {
      ...restDto,
      ...adminData,
    };
    if (user && user.actorType === ActorType.OPERATOR) {
      data.operatorId = new Types.ObjectId(user.sub);
    }
    return this.stopPointModel.create(data);
  }

  async findAll(
    query: StopPointQuery = {},
    user?: PrincipalContext,
  ): Promise<StopPointDocument[]> {
    const { isActive, wardName, provinceName, type, search } = query;
    // Khởi tạo filter với kiểu tường minh để tránh lỗi linter không resolve được FilterQuery
    const filter: {
      isActive?: boolean;
      wardName?: { $regex: string; $options: string };
      provinceName?: { $regex: string; $options: string };
      type?: StopPointType;
      $text?: { $search: string };
      $or?: any[];
    } = {};

    if (isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true' || isActive === true;
    }

    if (wardName) {
      filter.wardName = { $regex: wardName, $options: 'i' };
    }

    if (provinceName) {
      filter.provinceName = { $regex: provinceName, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (user && user.actorType === ActorType.OPERATOR) {
      filter.$or = [
        { operatorId: { $exists: false } },
        { operatorId: null },
        { operatorId: new Types.ObjectId(user.tenantId ?? user.sub) },
      ];
    }

    const queryFilter = filter as unknown as Parameters<
      Model<StopPointDocument>['find']
    >[0];

    return this.stopPointModel
      .find(queryFilter)
      .sort({ provinceName: 1, wardName: 1, name: 1 })
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
    user?: PrincipalContext,
  ): Promise<StopPoint> {
    const stopPoint = await this.stopPointModel.findById(id).exec();
    if (!stopPoint) {
      throw new NotFoundException('Không tìm thấy điểm dừng');
    }

    if (user && user.actorType === ActorType.OPERATOR) {
      if (String(stopPoint.operatorId) !== (user.tenantId ?? user.sub)) {
        throw new ForbiddenException('Bạn không có quyền sửa điểm dừng này');
      }
    }

    const updateData: Record<string, unknown> = { ...updateDto };
    const shouldValidateProvinceWard = Boolean(
      updateDto.provinceId || updateDto.wardId,
    );

    if (shouldValidateProvinceWard) {
      const resolvedProvinceId =
        updateDto.provinceId ?? String(stopPoint.provinceId);
      const resolvedWardId = updateDto.wardId ?? String(stopPoint.wardId);
      const adminData = await this.validateAndResolveProvinceWard(
        resolvedProvinceId,
        resolvedWardId,
      );

      updateData.provinceId = adminData.provinceId;
      updateData.wardId = adminData.wardId;
      updateData.provinceName = adminData.provinceName;
      updateData.wardName = adminData.wardName;
    }

    Object.assign(stopPoint, updateData);
    return stopPoint.save();
  }
  private async validateAndResolveProvinceWard(
    provinceId: string,
    wardId: string,
  ): Promise<{
    provinceId: Types.ObjectId;
    wardId: Types.ObjectId;
    provinceName: string;
    wardName: string;
  }> {
    const province = await this.provinceModel.findById(provinceId).exec();
    if (!province) {
      throw new NotFoundException('Không tìm thấy tỉnh/thành phố');
    }

    const ward = await this.wardModel.findById(wardId).exec();
    if (!ward) {
      throw new NotFoundException('Không tìm thấy phường/xã');
    }

    if (ward.provinceId.toString() !== provinceId.toString()) {
      throw new BadRequestException(
        'Ward does not belong to selected province',
      );
    }

    return {
      provinceId: new Types.ObjectId(provinceId),
      wardId: new Types.ObjectId(wardId),
      provinceName: province.name,
      wardName: ward.name,
    };
  }
  async remove(id: string, user?: PrincipalContext): Promise<void> {
    const stopPoint = await this.stopPointModel.findById(id).exec();
    if (!stopPoint) {
      throw new NotFoundException('Không tìm thấy điểm dừng');
    }

    if (user && user.actorType === ActorType.OPERATOR) {
      if (String(stopPoint.operatorId) !== (user.tenantId ?? user.sub)) {
        throw new ForbiddenException('Bạn không có quyền xóa điểm dừng này');
      }
    }

    await this.stopPointModel.findByIdAndDelete(id).exec();
  }
}
