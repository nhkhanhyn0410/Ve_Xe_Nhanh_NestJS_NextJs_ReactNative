import { IsMongoId, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignBusDto {
  @ApiProperty({ description: 'Bus ID cần gắn vào chuyến' })
  @IsMongoId()
  @IsNotEmpty()
  busId: string;
}

export class AssignCrewDto {
  @ApiProperty({
    type: [String],
    description: 'Employee IDs — phi hành đoàn (tài xế, quản lý chuyến)',
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  crew: string[];
}
