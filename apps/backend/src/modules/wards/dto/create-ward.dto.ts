import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { WardType } from '../schemas/ward.schema';

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

  @ApiProperty()
  @IsMongoId()
  provinceId: string;
}
