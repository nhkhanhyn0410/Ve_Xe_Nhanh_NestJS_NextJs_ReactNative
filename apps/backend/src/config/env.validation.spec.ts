import { describe, expect, it } from '@jest/globals';
import { validateEnv } from './env.validation';

const validBaseConfig = {
  MONGODB_URI: 'mongodb://localhost:27017/ve_xe_nhanh',
  JWT_SECRET: 'local-development-secret-with-32-chars',
};

describe('validateEnv', () => {
  it('normalizes local defaults and numeric values', () => {
    const env = validateEnv({
      ...validBaseConfig,
      PORT: '4000',
      THROTTLE_LIMIT: '25',
    });

    expect(env.NODE_ENV).toBe('development');
    expect(env.APP_ENV).toBe('local');
    expect(env.PORT).toBe(4000);
    expect(env.THROTTLE_LIMIT).toBe(25);
    expect(env.API_BASE_PATH).toBe('/api/v1');
    expect(env.OSRM_URL).toBe('http://localhost:5000');
  });

  it('fails fast when required config is missing', () => {
    expect(() => validateEnv({})).toThrow(/Config validation failed/);
    expect(() => validateEnv({})).toThrow(/MONGODB_URI/);
    expect(() => validateEnv({})).toThrow(/JWT_SECRET/);
  });

  it('rejects invalid allowed origins', () => {
    expect(() =>
      validateEnv({
        ...validBaseConfig,
        ALLOWED_ORIGINS: 'http://localhost:3000,not-a-url',
      }),
    ).toThrow(/ALLOWED_ORIGINS/);
  });

  it('enforces production-only safety rules', () => {
    expect(() =>
      validateEnv({
        ...validBaseConfig,
        NODE_ENV: 'production',
        APP_ENV: 'production',
        APP_BASE_URL: 'http://localhost:3000',
        COOKIE_SECURE: 'false',
        ALLOWED_ORIGINS: 'http://localhost:3000',
      }),
    ).toThrow(/APP_BASE_URL must be an https URL/);
  });

  it('accepts production config with secure public URLs', () => {
    const env = validateEnv({
      MONGODB_URI: 'mongodb://mongo-0.example.internal:27017/ve_xe_nhanh',
      NODE_ENV: 'production',
      APP_ENV: 'production',
      APP_BASE_URL: 'https://api.example.com',
      COOKIE_SECURE: 'true',
      JWT_SECRET: 'production-secret-with-at-least-forty-eight-characters',
      ALLOWED_ORIGINS: 'https://example.com,https://admin.example.com',
    });

    expect(env.APP_ENV).toBe('production');
    expect(env.COOKIE_SECURE).toBe(true);
  });
});
