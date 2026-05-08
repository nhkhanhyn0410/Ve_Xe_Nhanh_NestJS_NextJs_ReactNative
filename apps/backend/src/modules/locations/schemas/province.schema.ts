import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProvinceDocument = Province & Document;

@Schema({ timestamps: true })
export class Province {
  @Prop({ required: true, unique: true, index: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, trim: true, default: null })
  englishName?: string | null;

  @Prop({ required: true, trim: true })
  level: string;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
ProvinceSchema.index({ level: 1, name: 1 });
