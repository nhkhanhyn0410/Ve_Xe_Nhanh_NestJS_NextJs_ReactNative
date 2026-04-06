import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StopPointType, ICoordinates } from '@ve_xe_nhanh_ts/shared-types';

export type StopPointDocument = StopPoint & Document;

@Schema({ timestamps: true })
export class StopPoint {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: StopPointType, default: StopPointType.POINT })
  type: StopPointType;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  province: string;

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
StopPointSchema.index({ city: 1, type: 1 });
StopPointSchema.index({ name: 'text', city: 'text' });
StopPointSchema.index({ location: '2dsphere' });

// Tự động đồng bộ coordinates -> GeoJSON location
(StopPointSchema as any).pre('save', function (this: StopPointDocument) {
  if (this.coordinates) {
    this.location = {
      type: 'Point',
      coordinates: [this.coordinates.lng, this.coordinates.lat],
    };
  }
});
