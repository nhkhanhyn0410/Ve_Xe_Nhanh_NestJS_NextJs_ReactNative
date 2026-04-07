import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsNumber,
  Min,
  Max,
  Matches,
  IsArray,
  IsMongoId,
  IsEnum,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RouteStopRole } from '@ve_xe_nhanh_ts/shared-types';

export class RouteStopDto {
  @ApiProperty({ description: 'StopPoint ID (bắt buộc)' })
  @IsMongoId()
  stopPointId: string;

  @ApiProperty({
    enum: RouteStopRole,
    description: 'Vai trò: origin | stop | destination',
  })
  @IsEnum(RouteStopRole)
  role: RouteStopRole;

  @ApiProperty({ description: 'Thứ tự: 0 = origin, N = destination' })
  @IsNumber()
  @Min(0)
  order: number;

  @ApiProperty({ description: 'Phút từ lúc khởi hành đến stop này' })
  @IsNumber()
  @Min(0)
  estimatedArrivalMinutes: number;

  @ApiProperty({ default: 15 })
  @IsNumber()
  @Min(0)
  @Max(120)
  @IsOptional()
  stopDuration?: number;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'StopPoint IDs — điểm đón trung chuyển',
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  transitPickupIds?: string[];

  @ApiProperty({
    type: [String],
    required: false,
    description: 'StopPoint IDs — điểm trả trung chuyển',
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  transitDropoffIds?: string[];
}

export class CreateRouteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  routeName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9-]+$/, {
    message: 'Mã tuyến chỉ được chứa chữ hoa, số và dấu gạch ngang',
  })
  routeCode: string;

  @ApiProperty({
    type: [RouteStopDto],
    description: 'Tất cả điểm trên tuyến (origin + stops + destination)',
  })
  @IsArray()
  @ArrayMinSize(2, {
    message: 'Tuyến phải có ít nhất 2 điểm (origin + destination)',
  })
  @ValidateNested({ each: true })
  @Type(() => RouteStopDto)
  stops: RouteStopDto[];

  @ApiProperty()
  @IsNumber()
  @Min(0)
  distance: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  estimatedDuration: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
