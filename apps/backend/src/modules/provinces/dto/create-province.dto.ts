import { ApiProperty } from '@nestjs/swagger';
import { ProvinceType } from '@ve_xe_nhanh_ts/shared-types';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateProvinceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  // Dùng enum chung để Swagger, DTO và schema không bị lệch giá trị.
  @ApiProperty({ enum: ProvinceType, enumName: 'ProvinceType' })
  @IsEnum(ProvinceType)
  type: ProvinceType;
}
