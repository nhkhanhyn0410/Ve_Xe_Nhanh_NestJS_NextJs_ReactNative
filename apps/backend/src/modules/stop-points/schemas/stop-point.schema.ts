import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StopPointType, ICoordinates } from '@ve_xe_nhanh_ts/shared-types';

export type StopPointDocument = StopPoint & Document;

@Schema({ timestamps: true })
export class StopPoint {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: StopPointType, default: StopPointType.POINT })
  type: StopPointType;

  @Prop({ type: Types.ObjectId, ref: 'Province', required: true, index: true })
  provinceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Ward', required: true, index: true })
  wardId: Types.ObjectId;
  @Prop({ required: true, trim: true })
  provinceName: string;

  @Prop({ required: true, trim: true })
  wardName: string;

  @Prop({ trim: true })
  address: string;

  @Prop({
    type: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    required: true,
  })
  coordinates: ICoordinates;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Operator', index: true })
  operatorId?: Types.ObjectId;

  /**
   * Trường GeoJSON chuẩn cho MongoDB $geoNear.
   * Được tự động đồng bộ từ `coordinates` qua pre-save hook.
   */
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat] - GeoJSON format
    },
  })
  location?: { type: string; coordinates: number[] };
}

export const StopPointSchema = SchemaFactory.createForClass(StopPoint);
StopPointSchema.index({ provinceId: 1, wardId: 1, type: 1 });
StopPointSchema.index({ provinceName: 1, wardName: 1 });
StopPointSchema.index({ name: 'text', provinceName: 'text', wardName: 'text' });
StopPointSchema.index({ location: '2dsphere' });

// Tự động đồng bộ coordinates -> GeoJSON location
StopPointSchema.pre('save', function (this: StopPointDocument) {
  if (this.coordinates) {
    this.location = {
      type: 'Point',
      coordinates: [this.coordinates.lng, this.coordinates.lat],
    };
  }
});
