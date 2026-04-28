import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WardType } from '@ve_xe_nhanh_ts/shared-types';
import { Document, Types } from 'mongoose';

export type WardDocument = Ward & Document;

@Schema({ timestamps: true })
export class Ward {
  // Nhóm field định danh cơ bản của phường/xã trong danh mục hành chính.
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  code: string;

  @Prop({ type: String, enum: WardType, required: true })
  type: WardType;

  // Ward luôn gắn với một tỉnh/thành để filter và populate nhanh theo địa bàn.
  @Prop({
    type: Types.ObjectId,
    ref: 'Province',
    required: true,
    index: true,
  })
  provinceId: Types.ObjectId;
}

export const WardSchema = SchemaFactory.createForClass(Ward);
