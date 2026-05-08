import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWardDto {
  @ApiProperty({ example: '00008' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Phường Ngọc Hà' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ nullable: true, example: 'Lieu Giai Commune' })
  @IsOptional()
  @IsString()
  englishName?: string | null;

  @ApiProperty({ example: 'Phường' })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiPropertyOptional({ description: 'Mongo ObjectId của tỉnh/thành phố' })
  @IsOptional()
  @IsMongoId()
  provinceId?: string;

  @ApiPropertyOptional({ example: '01', description: 'Mã tỉnh/thành phố' })
  @IsOptional()
  @IsString()
  provinceCode?: string;
}
