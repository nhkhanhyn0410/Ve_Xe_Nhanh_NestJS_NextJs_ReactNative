import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip, TripSchema } from './schemas/trip.schema';
import { Bus, BusSchema } from '../buses/schemas/bus.schema';
import {
  Operator,
  OperatorSchema,
} from '../operators/schemas/operator.schema';
import {
  StopPoint,
  StopPointSchema,
} from '../stop-points/schemas/stop-point.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trip.name, schema: TripSchema },
      { name: Bus.name, schema: BusSchema },
      { name: Operator.name, schema: OperatorSchema },
      { name: StopPoint.name, schema: StopPointSchema },
    ]),
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
