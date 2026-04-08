import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { existsSync } from 'fs';
import Joi from 'joi';
import { config as loadEnv } from 'dotenv';
import { join, resolve } from 'path';

// Resolve from this module's directory so env loading is stable in a monorepo.
const backendRoot = resolve(__dirname, '..', '..');
const baseEnvPath = join(backendRoot, '.env');

// Load .env first so NODE_ENV can decide which environment file should be used.
loadEnv({ path: baseEnvPath });

const nodeEnv = process.env.NODE_ENV ?? 'development';
const environmentEnvPath = join(backendRoot, `.env.${nodeEnv}`);

const envFilePaths = existsSync(environmentEnvPath)
  ? [environmentEnvPath, baseEnvPath]
  : [baseEnvPath];

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number(),
        MONGODB_URI: Joi.string().required(),
        REDIS_HOST: Joi.string(),
        REDIS_PORT: Joi.number(),
        REDIS_USERNAME: Joi.string().allow(''),
        REDIS_PASSWORD: Joi.string().allow(''),
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_ACCESS_EXPIRES: Joi.string(),
        JWT_REFRESH_EXPIRES: Joi.string(),
        ALLOWED_ORIGINS: Joi.string(),
        THROTTLE_TTL: Joi.number(),
        THROTTLE_LIMIT: Joi.number(),
        OSRM_URL: Joi.string().uri().default('http://localhost:5000'),
      }),
    }),
  ],
})
export class AppConfigModule {}
