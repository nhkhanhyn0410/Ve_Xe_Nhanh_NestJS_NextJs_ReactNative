import { Module, Global } from '@nestjs/common';
import { OsrmService } from './osrm.service';

@Global()
@Module({
  providers: [OsrmService],
  exports: [OsrmService],
})
export class OsrmModule {}
