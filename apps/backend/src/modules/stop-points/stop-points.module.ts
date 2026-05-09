import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StopPointsService } from './stop-points.service';
import { StopPointsController } from './stop-points.controller';
import { StopPoint, StopPointSchema } from './schemas/stop-point.schema';
import { Province, ProvinceSchema } from '../locations/schemas/province.schema';
import { Ward, WardSchema } from '../locations/schemas/ward.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StopPoint.name, schema: StopPointSchema },
      { name: Province.name, schema: ProvinceSchema },
      { name: Ward.name, schema: WardSchema },
    ]),
  ],
  controllers: [StopPointsController],
  providers: [StopPointsService],
  exports: [StopPointsService],
})
export class StopPointsModule {}
