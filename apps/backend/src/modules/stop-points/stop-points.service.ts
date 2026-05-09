import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types } from 'mongoose';
import { StopPoint, StopPointDocument } from './schemas/stop-point.schema';
import {
  Province,
  ProvinceDocument,
} from '../locations/schemas/province.schema';
import { Ward, WardDocument } from '../locations/schemas/ward.schema';
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
  page?: number | string;
  limit?: number | string;
  sortBy?: 'name' | 'provinceName' | 'wardName' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface NearbyStopPointQuery {
  lat: number;
  lng: number;
  radiusKm?: number;
  limit?: number;
  type?: StopPointType;
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
  ): Promise<{
    data: StopPointDocument[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const {
      isActive,
      wardName,
      provinceName,
      type,
      search,
      sortBy = 'provinceName',
      sortOrder = 'asc',
    } = query;
    const page = this.toPositiveNumber(query.page, 1);
    const limit = Math.min(this.toPositiveNumber(query.limit, 20), 100);
    const skip = (page - 1) * limit;
    // Khởi tạo filter với kiểu tường minh để tránh lỗi linter không resolve được FilterQuery
    const filter: {
      isActive?: boolean;
      wardName?: { $regex: string; $options: string };
      provinceName?: { $regex: string; $options: string };
      type?: StopPointType;
      $text?: { $search: string };
      $or?: any[];
    } = {};

    if (isActive === undefined || isActive === '') {
      filter.isActive = true;
    } else {
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
    const sortDirection: SortOrder = sortOrder === 'desc' ? -1 : 1;
    const sort: Record<string, SortOrder> =
      sortBy === 'createdAt'
        ? { createdAt: sortDirection, name: 1 }
        : { [sortBy]: sortDirection, name: 1 };

    const [data, total] = await Promise.all([
      this.stopPointModel
        .find(queryFilter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.stopPointModel.countDocuments(queryFilter).exec(),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findNearby(query: NearbyStopPointQuery): Promise<StopPointDocument[]> {
    const radiusKm = query.radiusKm ?? 10;
    const limit = Math.min(query.limit ?? 10, 50);
    const geoQuery: Record<string, unknown> = { isActive: true };
    if (query.type) {
      geoQuery.type = query.type;
    }

    return this.stopPointModel
      .find({
        ...geoQuery,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [query.lng, query.lat],
            },
            $maxDistance: radiusKm * 1000,
          },
        },
      })
      .limit(limit)
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

    stopPoint.isActive = false;
    await stopPoint.save();
  }

  private toPositiveNumber(
    value: number | string | undefined,
    fallback: number,
  ): number {
    const numberValue = Number(value);
    if (!Number.isFinite(numberValue) || numberValue < 1) {
      return fallback;
    }
    return Math.floor(numberValue);
  }
}
