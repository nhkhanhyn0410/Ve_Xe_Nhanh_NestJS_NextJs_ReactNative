import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Province, ProvinceDocument } from './schemas/province.schema';

@Injectable()
export class ProvincesService {
  constructor(
    @InjectModel(Province.name)
    private provinceModel: Model<ProvinceDocument>,
  ) {}

  async create(createDto: CreateProvinceDto): Promise<ProvinceDocument> {
    await this.ensureCodeAvailable(createDto.code);

    try {
      const province = new this.provinceModel(createDto);
      return await province.save();
    } catch (error) {
      this.rethrowDuplicateCodeError(error);
    }
  }

  async findAll(): Promise<ProvinceDocument[]> {
    return this.provinceModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string): Promise<ProvinceDocument> {
    const province = await this.provinceModel.findById(id).exec();
    if (!province) {
      throw new NotFoundException('Khong tim thay tinh/thanh pho');
    }
    return province;
  }

  async update(
    id: string,
    updateDto: UpdateProvinceDto,
  ): Promise<ProvinceDocument> {
    const province = await this.provinceModel.findById(id).exec();
    if (!province) {
      throw new NotFoundException('Khong tim thay tinh/thanh pho');
    }

    if (updateDto.code && updateDto.code !== province.code) {
      await this.ensureCodeAvailable(updateDto.code, id);
    }

    Object.assign(province, updateDto);

    try {
      return await province.save();
    } catch (error) {
      this.rethrowDuplicateCodeError(error);
    }
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.provinceModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Khong tim thay tinh/thanh pho');
    }
  }

  private async ensureCodeAvailable(
    code: string,
    excludeId?: string,
  ): Promise<void> {
    const filter: QueryFilter<ProvinceDocument> = { code };

    if (excludeId) {
      filter._id = { $ne: excludeId };
    }

    const existingProvince = await this.provinceModel.exists(filter);

    if (existingProvince) {
      throw new ConflictException('Ma tinh/thanh pho da ton tai');
    }
  }

  private rethrowDuplicateCodeError(error: unknown): never {
    if (this.isDuplicateKeyError(error)) {
      throw new ConflictException('Ma tinh/thanh pho da ton tai');
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
