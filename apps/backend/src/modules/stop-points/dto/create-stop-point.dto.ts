import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StopPointType, ICoordinates } from '@ve_xe_nhanh_ts/shared-types';
import { ApiProperty } from '@nestjs/swagger';

export class CoordinatesDto implements ICoordinates {
  @ApiProperty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNumber()
  lng: number;
}

export class CreateStopPointDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: StopPointType, enumName: 'StopPointType' })
  @IsEnum(StopPointType)
  type: StopPointType;

  @ApiProperty()
  @IsMongoId()
  provinceId: string;

  @ApiProperty()
  @IsMongoId()
  wardId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
