import { Controller, Get, Req } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { RequestWithContext } from '../common/interfaces/request-context.interface';
import { HealthService } from './health.service';
import { HealthResponse } from './health.types';

@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  getHealth(@Req() request: RequestWithContext): HealthResponse {
    return this.healthService.getHealth(request.requestContext);
  }
}
