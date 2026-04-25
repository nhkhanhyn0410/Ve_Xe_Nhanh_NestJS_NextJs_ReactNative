import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProvinceType } from '../schemas/province.schema';

export class CreateProvinceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: ProvinceType, enumName: 'ProvinceType' })
  @IsEnum(ProvinceType)
  type: ProvinceType;
}
