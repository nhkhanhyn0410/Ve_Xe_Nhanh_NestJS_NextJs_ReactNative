import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { Ward, WardDocument } from './schemas/ward.schema';
import {
  Province,
  ProvinceDocument,
} from '../provinces/schemas/province.schema';

@Injectable()
export class WardsService {
  constructor(
    @InjectModel(Ward.name)
    private wardModel: Model<WardDocument>,
    @InjectModel(Province.name)
    private provinceModel: Model<ProvinceDocument>,
  ) {}

  async create(createDto: CreateWardDto): Promise<WardDocument> {
    const provinceId = this.toObjectId(createDto.provinceId, 'provinceId');
    await this.ensureProvinceExists(provinceId);
    await this.ensureCodeAvailable(createDto.code);

    try {
      const ward = new this.wardModel({
        ...createDto,
        provinceId,
      });
      await ward.save();
      return this.findOne(String(ward._id));
    } catch (error) {
      this.rethrowDuplicateCodeError(error);
    }
  }

  async findAll(provinceId?: string): Promise<WardDocument[]> {
    const queryFilter = (
      provinceId
        ? { provinceId: this.toObjectId(provinceId, 'provinceId') }
        : {}
    ) as Parameters<Model<WardDocument>['find']>[0];

    return this.wardModel
      .find(queryFilter)
      .sort({ name: 1 })
      .populate('provinceId', 'name code type')
      .exec();
  }

  async findOne(id: string): Promise<WardDocument> {
    const ward = await this.wardModel
      .findById(id)
      .populate('provinceId', 'name code type')
      .exec();

    if (!ward) {
      throw new NotFoundException('Không tìm thấy phường/xã');
    }
    return ward;
  }

  async update(id: string, updateDto: UpdateWardDto): Promise<WardDocument> {
    const ward = await this.wardModel.findById(id).exec();
    if (!ward) {
      throw new NotFoundException('Không tìm thấy phường/xã');
    }

    if (updateDto.code && updateDto.code !== ward.code) {
      await this.ensureCodeAvailable(updateDto.code, id);
    }

    // provinceId xử lý riêng vì cần ép kiểu ObjectId và validate bản ghi cha.
    if (updateDto.provinceId) {
      ward.provinceId = this.toObjectId(updateDto.provinceId, 'provinceId');
      await this.ensureProvinceExists(ward.provinceId);
    }

    if (updateDto.name !== undefined) {
      ward.name = updateDto.name;
    }

    if (updateDto.code !== undefined) {
      ward.code = updateDto.code;
    }

    if (updateDto.type !== undefined) {
      ward.type = updateDto.type;
    }

    try {
      await ward.save();
      return this.findOne(id);
    } catch (error) {
      this.rethrowDuplicateCodeError(error);
    }
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.wardModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy phường/xã');
    }
  }

  private toObjectId(value: string, fieldName: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `${fieldName} must be a valid Mongo ObjectId`,
      );
    }

    return new Types.ObjectId(value);
  }

  private async ensureProvinceExists(
    provinceId: Types.ObjectId,
  ): Promise<void> {
    const province = await this.provinceModel.exists({ _id: provinceId });

    if (!province) {
      throw new NotFoundException('Không tìm thấy tỉnh/thành phố');
    }
  }

  private async ensureCodeAvailable(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const filter: QueryFilter<WardDocument> = { code };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existingWard = await this.wardModel.exists(filter);

    if (existingWard) {
      throw new ConflictException('Mã phường/xã đã tồn tại');
    }
  }

  private rethrowDuplicateCodeError(error: unknown): never {
    if (this.isDuplicateKeyError(error)) {
      throw new ConflictException('Mã phường/xã đã tồn tại');
    }

    throw error;
  }

  private isDuplicateKeyError(error: unknown): error is { code: number } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: number }).code === 11000
    );
  }
}
