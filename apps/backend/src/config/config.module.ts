import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { existsSync } from 'fs';
import { config as loadEnv } from 'dotenv';
import { join, resolve } from 'path';
import { validateEnv } from './env.validation';

// Resolve from this module's directory so env loading is stable in a monorepo.
const backendRoot = resolve(__dirname, '..', '..', '..');
const baseEnvPath = join(backendRoot, '.env');

// Load .env first so NODE_ENV can decide which environment file should be used.
loadEnv({
  path: baseEnvPath,
  override: false,
});

const nodeEnv = process.env.NODE_ENV?.trim() || 'development';
const environmentEnvPath = join(backendRoot, `.env.${nodeEnv}`);

const envFilePaths = existsSync(environmentEnvPath)
  ? [environmentEnvPath, baseEnvPath]
  : [baseEnvPath];

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths,
      cache: true,
      expandVariables: true,
      validate: validateEnv,
    }),
  ],
})
export class AppConfigModule {}
