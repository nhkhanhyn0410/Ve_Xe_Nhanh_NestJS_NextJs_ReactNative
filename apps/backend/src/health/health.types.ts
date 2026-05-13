export type HealthStatus = 'ok' | 'degraded';
export type DependencyStatus = 'connected' | 'connecting' | 'disconnected';

export interface HealthResponse {
  readonly status: HealthStatus;
  readonly timestamp: string;
  readonly uptimeSeconds: number;
  readonly requestId?: string;
  readonly app: {
    readonly environment: string;
    readonly nodeEnvironment: string;
    readonly apiBasePath: string;
  };
  readonly dependencies: {
    readonly mongodb: DependencyStatus;
  };
}
