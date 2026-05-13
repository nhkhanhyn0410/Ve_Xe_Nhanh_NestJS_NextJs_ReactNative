import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, STATES } from 'mongoose';
import { RequestContext } from '../common/interfaces/request-context.interface';
import { DependencyStatus, HealthResponse, HealthStatus } from './health.types';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
  ) {}

  getHealth(requestContext?: RequestContext): HealthResponse {
    const mongodb = this.getMongoStatus();

    return {
      status: this.getOverallStatus(mongodb),
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      ...(requestContext ? { requestId: requestContext.requestId } : {}),
      app: {
        environment: this.configService.get<string>('APP_ENV', 'local'),
        nodeEnvironment: this.configService.get<string>(
          'NODE_ENV',
          'development',
        ),
        apiBasePath: this.configService.get<string>('API_BASE_PATH', '/api/v1'),
      },
      dependencies: {
        mongodb,
      },
    };
  }

  private getMongoStatus(): DependencyStatus {
    if (this.connection.readyState === STATES.connected) {
      return 'connected';
    }

    if (this.connection.readyState === STATES.connecting) {
      return 'connecting';
    }

    return 'disconnected';
  }

  private getOverallStatus(mongodb: DependencyStatus): HealthStatus {
    return mongodb === 'connected' ? 'ok' : 'degraded';
  }
}
