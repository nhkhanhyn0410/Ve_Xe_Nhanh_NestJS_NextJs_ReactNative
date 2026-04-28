import { ApiProperty } from '@nestjs/swagger';
import { WardType } from '@ve_xe_nhanh_ts/shared-types';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateWardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: WardType, enumName: 'WardType' })
  @IsEnum(WardType)
  type: WardType;

  // API nhận string; service sẽ đổi sang ObjectId và kiểm tra tỉnh cha có tồn tại.
  @ApiProperty()
  @IsMongoId()
  provinceId: string;
}
