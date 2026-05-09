import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WardDocument = Ward & Document;

@Schema({ timestamps: true })
export class Ward {
  @Prop({ required: true, unique: true, index: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, trim: true, default: null })
  englishName?: string | null;

  @Prop({ required: true, trim: true })
  level: string;

  @Prop({ required: true, index: true, trim: true })
  provinceCode: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Province',
    required: true,
    index: true,
  })
  provinceId: Types.ObjectId;
}

export const WardSchema = SchemaFactory.createForClass(Ward);
WardSchema.index({ provinceId: 1, name: 1 });
WardSchema.index({ provinceCode: 1, code: 1 });
