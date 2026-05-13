import { describe, expect, it } from '@jest/globals';
import { ConfigService } from '@nestjs/config';
import { Connection, STATES } from 'mongoose';
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns ok when MongoDB is connected', () => {
    const service = new HealthService(
      createConnection(STATES.connected),
      createConfigService(),
    );

    const health = service.getHealth({
      requestId: 'req-123',
      method: 'GET',
      path: '/api/v1/health',
      receivedAt: '2026-05-13T00:00:00.000Z',
    });

    expect(health.status).toBe('ok');
    expect(health.requestId).toBe('req-123');
    expect(health.app).toEqual({
      environment: 'local',
      nodeEnvironment: 'development',
      apiBasePath: '/api/v1',
    });
    expect(health.dependencies.mongodb).toBe('connected');
  });

  it('returns degraded when MongoDB is disconnected', () => {
    const service = new HealthService(
      createConnection(STATES.disconnected),
      createConfigService(),
    );

    const health = service.getHealth();

    expect(health.status).toBe('degraded');
    expect(health.dependencies.mongodb).toBe('disconnected');
  });
});

function createConnection(readyState: number): Connection {
  return { readyState } as Connection;
}

function createConfigService(): ConfigService {
  const values: Record<string, string> = {
    APP_ENV: 'local',
    NODE_ENV: 'development',
    API_BASE_PATH: '/api/v1',
  };

  return {
    get<T = string>(key: string, defaultValue?: T): T {
      return (values[key] ?? defaultValue) as T;
    },
  } as ConfigService;
}
