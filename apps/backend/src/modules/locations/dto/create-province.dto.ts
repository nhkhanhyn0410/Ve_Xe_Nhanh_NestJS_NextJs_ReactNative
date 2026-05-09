import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProvinceDto {
  @ApiProperty({ example: '01' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Thành phố Hà Nội' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ nullable: true, example: null })
  @IsOptional()
  @IsString()
  englishName?: string | null;

  @ApiProperty({ example: 'Thành phố Trung ương' })
  @IsString()
  @IsNotEmpty()
  level: string;
}
