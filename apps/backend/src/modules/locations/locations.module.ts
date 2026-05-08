import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StopPoint,
  StopPointSchema,
} from '../stop-points/schemas/stop-point.schema';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Province, ProvinceSchema } from './schemas/province.schema';
import { Ward, WardSchema } from './schemas/ward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Province.name, schema: ProvinceSchema },
      { name: Ward.name, schema: WardSchema },
      { name: StopPoint.name, schema: StopPointSchema },
    ]),
  ],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService, MongooseModule],
})
export class LocationsModule {}
