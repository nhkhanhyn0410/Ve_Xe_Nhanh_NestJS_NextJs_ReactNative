import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProvinceDocument = Province & Document;

export enum ProvinceType {
  PROVINCE = 'province',
  MUNICIPALITY = 'municipality',
}

@Schema({ timestamps: true })
export class Province {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, index: true, trim: true })
  code: string;

  @Prop({ type: String, enum: Object.values(ProvinceType), required: true })
  type: ProvinceType;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
