import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import {
  StopPoint,
  StopPointDocument,
} from '../stop-points/schemas/stop-point.schema';
import { CreateProvinceDto } from './dto/create-province.dto';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { Province, ProvinceDocument } from './schemas/province.schema';
import { Ward, WardDocument } from './schemas/ward.schema';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Province.name)
    private provinceModel: Model<ProvinceDocument>,
    @InjectModel(Ward.name)
    private wardModel: Model<WardDocument>,
    @InjectModel(StopPoint.name)
    private stopPointModel: Model<StopPointDocument>,
  ) {}

  async createProvince(
    createDto: CreateProvinceDto,
  ): Promise<ProvinceDocument> {
    await this.ensureProvinceCodeAvailable(createDto.code);

    try {
      const province = new this.provinceModel({
        ...createDto,
        englishName: this.normalizeOptionalText(createDto.englishName),
      });
      return await province.save();
    } catch (error) {
      this.rethrowDuplicateCodeError(error, 'Mã tỉnh/thành phố đã tồn tại');
    }
  }

  async findAllProvinces(): Promise<ProvinceDocument[]> {
    return this.provinceModel.find().sort({ code: 1 }).exec();
  }

  async findOneProvince(id: string): Promise<ProvinceDocument> {
    const province = await this.provinceModel.findById(id).exec();
    if (!province) {
      throw new NotFoundException('Không tìm thấy tỉnh/thành phố');
    }
    return province;
  }

  async updateProvince(
    id: string,
    updateDto: UpdateProvinceDto,
  ): Promise<ProvinceDocument> {
    const province = await this.provinceModel.findById(id).exec();
    if (!province) {
      throw new NotFoundException('Không tìm thấy tỉnh/thành phố');
    }

    const oldName = province.name;
    const oldCode = province.code;

    if (updateDto.code && updateDto.code !== province.code) {
      await this.ensureProvinceCodeAvailable(updateDto.code, id);
    }

    if (updateDto.code !== undefined) province.code = updateDto.code;
    if (updateDto.name !== undefined) province.name = updateDto.name;
    if (updateDto.level !== undefined) province.level = updateDto.level;
    if (updateDto.englishName !== undefined) {
      province.englishName = this.normalizeOptionalText(updateDto.englishName);
    }

    try {
      const savedProvince = await province.save();
      const provinceObjectId = this.toObjectId(id, 'provinceId');
      const syncTasks: Promise<unknown>[] = [];

      if (savedProvince.name !== oldName) {
        syncTasks.push(
          this.stopPointModel
            .updateMany(
              { provinceId: provinceObjectId },
              { $set: { provinceName: savedProvince.name } },
            )
            .exec(),
        );
      }

      if (savedProvince.code !== oldCode) {
        syncTasks.push(
          this.wardModel
            .updateMany(
              { provinceId: provinceObjectId },
              { $set: { provinceCode: savedProvince.code } },
            )
            .exec(),
        );
      }

      await Promise.all(syncTasks);
      return savedProvince;
    } catch (error) {
      this.rethrowDuplicateCodeError(error, 'Mã tỉnh/thành phố đã tồn tại');
    }
  }

  async removeProvince(id: string): Promise<void> {
    const provinceObjectId = this.toObjectId(id, 'provinceId');
    const hasWard = await this.wardModel.exists({
      provinceId: provinceObjectId,
    });
    if (hasWard) {
      throw new ConflictException(
        'Không thể xóa tỉnh/thành phố đang có phường/xã',
      );
    }

    const hasStopPoint = await this.stopPointModel.exists({
      provinceId: provinceObjectId,
    });
    if (hasStopPoint) {
      throw new ConflictException(
        'Không thể xóa tỉnh/thành phố đang được dùng bởi điểm dừng',
      );
    }

    const deleted = await this.provinceModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy tỉnh/thành phố');
    }
  }

  async createWard(createDto: CreateWardDto): Promise<WardDocument> {
    const province = await this.resolveProvince(
      createDto.provinceId,
      createDto.provinceCode,
    );
    await this.ensureWardCodeAvailable(createDto.code);

    try {
      const ward = new this.wardModel({
        code: createDto.code,
        name: createDto.name,
        englishName: this.normalizeOptionalText(createDto.englishName),
        level: createDto.level,
        provinceId: this.toObjectId(String(province._id), 'provinceId'),
        provinceCode: province.code,
      });
      await ward.save();
      return this.findOneWard(String(ward._id));
    } catch (error) {
      this.rethrowDuplicateCodeError(error, 'Mã phường/xã đã tồn tại');
    }
  }

  async findAllWards(
    provinceId?: string,
    provinceCode?: string,
  ): Promise<WardDocument[]> {
    const queryFilter: QueryFilter<WardDocument> = {};

    if (provinceId) {
      queryFilter.provinceId = this.toObjectId(provinceId, 'provinceId');
    }

    if (provinceCode) {
      queryFilter.provinceCode = provinceCode;
    }

    return this.wardModel
      .find(queryFilter)
      .sort({ provinceCode: 1, code: 1 })
      .populate('provinceId', 'name code englishName level')
      .exec();
  }

  async findOneWard(id: string): Promise<WardDocument> {
    const ward = await this.wardModel
      .findById(id)
      .populate('provinceId', 'name code englishName level')
      .exec();

    if (!ward) {
      throw new NotFoundException('Không tìm thấy phường/xã');
    }
    return ward;
  }

  async updateWard(
    id: string,
    updateDto: UpdateWardDto,
  ): Promise<WardDocument> {
    const ward = await this.wardModel.findById(id).exec();
    if (!ward) {
      throw new NotFoundException('Không tìm thấy phường/xã');
    }

    const oldName = ward.name;
    const shouldResolveProvince = Boolean(
      updateDto.provinceId || updateDto.provinceCode,
    );

    if (updateDto.code && updateDto.code !== ward.code) {
      await this.ensureWardCodeAvailable(updateDto.code, id);
    }

    if (shouldResolveProvince) {
      const province = await this.resolveProvince(
        updateDto.provinceId,
        updateDto.provinceCode,
      );
      ward.provinceId = this.toObjectId(String(province._id), 'provinceId');
      ward.provinceCode = province.code;
    }

    if (updateDto.code !== undefined) ward.code = updateDto.code;
    if (updateDto.name !== undefined) ward.name = updateDto.name;
    if (updateDto.level !== undefined) ward.level = updateDto.level;
    if (updateDto.englishName !== undefined) {
      ward.englishName = this.normalizeOptionalText(updateDto.englishName);
    }

    try {
      await ward.save();

      if (ward.name !== oldName || shouldResolveProvince) {
        const province = await this.provinceModel
          .findById(ward.provinceId)
          .exec();
        if (!province) {
          throw new NotFoundException('Không tìm thấy tỉnh/thành phố');
        }

        await this.stopPointModel
          .updateMany(
            { wardId: this.toObjectId(id, 'wardId') },
            {
              $set: {
                wardName: ward.name,
                provinceId: ward.provinceId,
                provinceName: province.name,
              },
            },
          )
          .exec();
      }

      return this.findOneWard(id);
    } catch (error) {
      this.rethrowDuplicateCodeError(error, 'Mã phường/xã đã tồn tại');
    }
  }

  async removeWard(id: string): Promise<void> {
    const wardObjectId = this.toObjectId(id, 'wardId');
    const hasStopPoint = await this.stopPointModel.exists({
      wardId: wardObjectId,
    });
    if (hasStopPoint) {
      throw new ConflictException(
        'Không thể xóa phường/xã đang được dùng bởi điểm dừng',
      );
    }

    const deleted = await this.wardModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy phường/xã');
    }
  }

  private async resolveProvince(
    provinceId?: string,
    provinceCode?: string,
  ): Promise<ProvinceDocument> {
    if (!provinceId && !provinceCode) {
      throw new BadRequestException('provinceId hoặc provinceCode là bắt buộc');
    }

    const province = provinceId
      ? await this.provinceModel.findById(provinceId).exec()
      : await this.provinceModel.findOne({ code: provinceCode }).exec();

    if (!province) {
      throw new NotFoundException('Không tìm thấy tỉnh/thành phố');
    }

    if (provinceCode && province.code !== provinceCode) {
      throw new BadRequestException(
        'provinceCode không khớp với provinceId đã chọn',
      );
    }

    return province;
  }

  private toObjectId(value: string, fieldName: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        `${fieldName} must be a valid Mongo ObjectId`,
      );
    }

    return new Types.ObjectId(value);
  }

  private async ensureProvinceCodeAvailable(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const filter: QueryFilter<ProvinceDocument> = { code };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existingProvince = await this.provinceModel.exists(filter);

    if (existingProvince) {
      throw new ConflictException('Mã tỉnh/thành phố đã tồn tại');
    }
  }

  private async ensureWardCodeAvailable(
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

  private normalizeOptionalText(value?: string | null): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : null;
  }

  private rethrowDuplicateCodeError(error: unknown, message: string): never {
    if (this.isDuplicateKeyError(error)) {
      throw new ConflictException(message);
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
