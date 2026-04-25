import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WardDocument = Ward & Document;

export enum WardType {
  WARD = 'ward',
  COMMUNE = 'commune',
}

@Schema({ timestamps: true })
export class Ward {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  code: string;

  @Prop({ type: String, enum: Object.values(WardType), required: true })
  type: WardType;

  @Prop({
    type: Types.ObjectId,
    ref: 'Province',
    required: true,
    index: true,
  })
  provinceId: Types.ObjectId;
}

export const WardSchema = SchemaFactory.createForClass(Ward);
