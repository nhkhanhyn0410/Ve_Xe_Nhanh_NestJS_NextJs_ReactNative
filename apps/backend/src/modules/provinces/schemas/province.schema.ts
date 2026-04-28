import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProvinceType } from '@ve_xe_nhanh_ts/shared-types';
import { Document } from 'mongoose';

export type ProvinceDocument = Province & Document;

@Schema({ timestamps: true })
export class Province {
  // Bộ field lõi để map danh mục tỉnh/thành nhất quán giữa DB và client.
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  code: string;

  @Prop({ type: String, enum: ProvinceType, required: true })
  type: ProvinceType;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
