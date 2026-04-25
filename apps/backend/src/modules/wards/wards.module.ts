import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ward, WardSchema } from './schemas/ward.schema';
import { WardsController } from './wards.controller';
import { WardsService } from './wards.service';
import { Province, ProvinceSchema } from '../provinces/schemas/province.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ward.name, schema: WardSchema },
      { name: Province.name, schema: ProvinceSchema },
    ]),
  ],
  controllers: [WardsController],
  providers: [WardsService],
  exports: [WardsService, MongooseModule],
})
export class WardsModule {}
