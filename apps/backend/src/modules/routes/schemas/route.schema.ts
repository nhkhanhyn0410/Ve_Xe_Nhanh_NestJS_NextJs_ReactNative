import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RouteStopRole } from '@ve_xe_nhanh_ts/shared-types';

export type RouteDocument = Route & Document;

@Schema({ _id: true })
export class RouteStop {
  /** Tham chiếu đến StopPoint — BẮT BUỘC */
  @Prop({ type: Types.ObjectId, ref: 'StopPoint', required: true, index: true })
  stopPointId: Types.ObjectId;

  /** Vai trò: origin | stop | destination */
  @Prop({
    type: String,
    enum: Object.values(RouteStopRole),
    required: true,
    default: RouteStopRole.STOP,
  })
  role: RouteStopRole;

  /** Thứ tự trên tuyến: 0 = origin, N = destination */
  @Prop({ required: true, min: 0 })
  order: number;

  /** Số phút tính từ lúc khởi hành đến khi xe tới stop này */
  @Prop({ required: true, min: 0 })
  estimatedArrivalMinutes: number;

  @Prop({ required: true, min: 0, max: 120, default: 15 })
  stopDuration: number;

  /** Điểm đón trung chuyển phục vụ stop này → ref StopPoint[] */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'StopPoint' }], default: [] })
  transitPickupIds: Types.ObjectId[];

  /** Điểm trả trung chuyển phục vụ stop này → ref StopPoint[] */
  @Prop({ type: [{ type: Types.ObjectId, ref: 'StopPoint' }], default: [] })
  transitDropoffIds: Types.ObjectId[];
}
export const RouteStopSchema = SchemaFactory.createForClass(RouteStop);

@Schema({ timestamps: true })
export class Route {
  @Prop({
    type: Types.ObjectId,
    ref: 'Operator',
    required: true,
    index: true,
  })
  operatorId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 200 })
  routeName: string;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  routeCode: string;

  /** Tất cả điểm trên tuyến: origin (order=0) + stops + destination (order=N) */
  @Prop({ type: [RouteStopSchema], required: true })
  stops: RouteStop[];

  @Prop({ required: true, min: 0, max: 5000 })
  distance: number;

  @Prop({ required: true, min: 0, max: 2880 })
  estimatedDuration: number;

  @Prop({ default: true, index: true })
  isActive: boolean;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
// Index cho tìm kiếm theo role + stopPointId
RouteSchema.index({ 'stops.role': 1, 'stops.stopPointId': 1 });
// Index cho sub-route matching
RouteSchema.index({ 'stops.stopPointId': 1 });
