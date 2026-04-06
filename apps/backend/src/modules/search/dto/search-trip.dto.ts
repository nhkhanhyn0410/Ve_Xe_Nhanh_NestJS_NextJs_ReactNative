import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

// ─── Nearby Search ───────────────────────────────────────────────────

export class NearbySearchDto {
  @ApiProperty({ description: 'Vĩ độ (latitude)' })
  @Transform(({ value }) => parseFloat(value as string))
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ description: 'Kinh độ (longitude)' })
  @Transform(({ value }) => parseFloat(value as string))
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @ApiProperty({
    required: false,
    description: 'Bán kính tìm kiếm (km)',
    default: 10,
  })
  @Transform(({ value }) => (value ? parseFloat(value as string) : undefined))
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  radiusKm?: number;
}

// ─── Trip Search ─────────────────────────────────────────────────────

export enum SortBy {
  PRICE = 'price',
  TIME = 'time',
  DURATION = 'duration',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SearchTripDto {
  @ApiProperty({ description: 'StopPoint ID điểm đi' })
  @IsString()
  @IsNotEmpty()
  originId: string;

  @ApiProperty({ description: 'StopPoint ID điểm đến' })
  @IsString()
  @IsNotEmpty()
  destinationId: string;

  @ApiProperty({ description: 'Ngày đi (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ required: false, description: 'Số hành khách', default: 1 })
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  passengers?: number;

  // ─── Filters ─────────────────────────────────────────────────────

  @ApiProperty({ required: false, description: 'Giá tối thiểu (VND)' })
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @ApiProperty({ required: false, description: 'Giá tối đa (VND)' })
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @ApiProperty({
    required: false,
    description: 'Giờ khởi hành sớm nhất (HH:mm)',
  })
  @IsString()
  @IsOptional()
  departureTimeStart?: string;

  @ApiProperty({
    required: false,
    description: 'Giờ khởi hành trễ nhất (HH:mm)',
  })
  @IsString()
  @IsOptional()
  departureTimeEnd?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo nhà xe (Operator ID)',
  })
  @IsString()
  @IsOptional()
  operatorId?: string;

  @ApiProperty({
    required: false,
    description: 'Lọc theo loại xe (SEATER, SLEEPER...)',
  })
  @IsString()
  @IsOptional()
  busType?: string;

  // ─── Sort ────────────────────────────────────────────────────────

  @ApiProperty({ required: false, enum: SortBy, default: SortBy.TIME })
  @IsEnum(SortBy)
  @IsOptional()
  sortBy?: SortBy;

  @ApiProperty({ required: false, enum: SortOrder, default: SortOrder.ASC })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder;

  // ─── Pagination ──────────────────────────────────────────────────

  @ApiProperty({ required: false, default: 20 })
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, default: 0 })
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number;
}
