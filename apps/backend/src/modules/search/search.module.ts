import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { GeoSearchStrategy } from './strategies/geo-search.strategy';
import { SubRouteStrategy } from './strategies/sub-route.strategy';
import { TransferMatchStrategy } from './strategies/transfer-match.strategy';
import {
  StopPoint,
  StopPointSchema,
} from '../stop-points/schemas/stop-point.schema';
import { Route, RouteSchema } from '../routes/schemas/route.schema';
import { Trip, TripSchema } from '../trips/schemas/trip.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Operator, OperatorSchema } from '../operators/schemas/operator.schema';
import { Bus, BusSchema } from '../buses/schemas/bus.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StopPoint.name, schema: StopPointSchema },
      { name: Route.name, schema: RouteSchema },
      { name: Trip.name, schema: TripSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Operator.name, schema: OperatorSchema },
      { name: Bus.name, schema: BusSchema },
    ]),
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    GeoSearchStrategy,
    SubRouteStrategy,
    TransferMatchStrategy,
  ],
  exports: [SearchService],
})
export class SearchModule {}
