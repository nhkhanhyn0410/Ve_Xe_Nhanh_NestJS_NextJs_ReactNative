import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
  IsBoolean,
  MaxLength,
  Matches,
} from 'class-validator';
import { EmployeeRole, Gender } from '@ve_xe_nhanh_ts/shared-types';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Họ và tên nhân viên' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Số điện thoại liên hệ' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10,11}$/, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @ApiPropertyOptional({ description: 'Email nhân viên' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Mật khẩu (dành cho tương lai)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  password?: string;

  @ApiPropertyOptional({ description: 'Giới tính', enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: 'Ngày sinh (ISO Date)' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Vai trò nhân viên', enum: EmployeeRole })
  @IsEnum(EmployeeRole)
  @IsNotEmpty()
  role: EmployeeRole;

  @ApiPropertyOptional({ description: 'Trạng thái hoạt động', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // ===== THONG TIN TAI XE =====
  @ApiPropertyOptional({ description: 'Số bằng lái (nếu là tài xế)' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ description: 'Hạng bằng lái (nếu là tài xế)' })
  @IsOptional()
  @IsString()
  licenseClass?: string;

  @ApiPropertyOptional({ description: 'Ngày hết hạn bằng lái' })
  @IsOptional()
  @IsDateString()
  licenseExpiryDate?: Date;

  // ===== THONG TIN NHAN SU =====
  @ApiPropertyOptional({ description: 'Ngày vào làm' })
  @IsOptional()
  @IsDateString()
  joinedDate?: Date;

  @ApiPropertyOptional({ description: 'Ngày nghỉ việc' })
  @IsOptional()
  @IsDateString()
  resignedDate?: Date;

  @ApiPropertyOptional({ description: 'Ghi chú thêm' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
