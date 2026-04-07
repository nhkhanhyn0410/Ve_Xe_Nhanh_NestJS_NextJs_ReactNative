import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EmployeeRole, Gender } from '@ve_xe_nhanh_ts/shared-types';

export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  // ===== THONG TIN CO BAN =====
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ type: String, enum: Gender })
  gender?: Gender;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop()
  avatar?: string;

  // ===== THONG TIN KINH DOANH / NGHIEP VU =====
  @Prop({
    type: Types.ObjectId,
    ref: 'Operator',
    required: true,
    index: true,
  })
  operatorId: Types.ObjectId;

  @Prop({ required: true, uppercase: true, trim: true, unique: true })
  employeeCode: string;

  @Prop({
    type: String,
    enum: EmployeeRole,
    required: true,
    index: true,
  })
  role: EmployeeRole;

  @Prop({ default: true, index: true })
  isActive: boolean; // Dùng cho soft delete và quản lý trạng thái

  // ===== THONG TIN TAI XE (Optional) =====
  @Prop({ trim: true })
  licenseNumber?: string;

  @Prop({ trim: true })
  licenseClass?: string;

  @Prop({ type: Date })
  licenseExpiryDate?: Date;

  // ===== THONG TIN NHAN SU (Optional) =====
  @Prop({ type: Date })
  joinedDate?: Date;

  @Prop({ type: Date })
  resignedDate?: Date;

  @Prop({ maxlength: 1000 })
  note?: string;

  @Prop({ default: 0 })
  totalWorkingDays?: number;

  @Prop({ default: 0 })
  totalWorkingHours?: number;

  @Prop({ default: 0 })
  totalSalary?: number;

  @Prop({ default: 0 })
  totalLeaveDays?: number;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

// Unique employeeCode within the system (or at least within operator)
// Actually employeeCode is set as unique: true across the whole collection.
EmployeeSchema.index({ operatorId: 1, employeeCode: 1 }, { unique: true });
EmployeeSchema.index({ operatorId: 1, isActive: 1 });
