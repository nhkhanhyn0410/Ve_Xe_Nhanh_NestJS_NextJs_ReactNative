import Joi from 'joi';

const nodeEnvironments = ['development', 'test', 'production'] as const;
const appEnvironments = ['local', 'ci', 'staging', 'production'] as const;

export type NodeEnvironment = (typeof nodeEnvironments)[number];
export type AppEnvironment = (typeof appEnvironments)[number];

export type ValidatedEnvironment = Record<string, unknown> & {
  NODE_ENV: NodeEnvironment;
  APP_ENV: AppEnvironment;
  APP_BASE_URL?: string;
  API_BASE_PATH: string;
  PORT: number;
  MONGODB_URI: string;
  MONGODB_DB_NAME?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  REDIS_USERNAME?: string;
  REDIS_PASSWORD?: string;
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRES: number;
  JWT_REFRESH_EXPIRES: number;
  ALLOWED_ORIGINS: string;
  THROTTLE_TTL: number;
  THROTTLE_LIMIT: number;
  OSRM_URL: string;
  COOKIE_SECURE: boolean;
  CSRF_ENABLED: boolean;
  STORAGE_SIGNED_URL_TTL_SECONDS: number;
};

const optionalString = Joi.string().trim().empty('');
const optionalNumber = Joi.number().empty('');

const envValidationSchema = Joi.object<ValidatedEnvironment>({
  NODE_ENV: Joi.string()
    .valid(...nodeEnvironments)
    .default('development'),
  APP_ENV: Joi.string().valid(...appEnvironments),
  APP_BASE_URL: optionalString.uri({ scheme: ['http', 'https'] }),
  API_BASE_PATH: Joi.string()
    .trim()
    .pattern(/^\/[a-zA-Z0-9/_-]*$/)
    .default('/api/v1'),
  PORT: optionalNumber.port().default(3000),

  MONGODB_URI: Joi.string()
    .trim()
    .uri({ scheme: [/mongodb(\+srv)?/] })
    .required(),
  MONGODB_DB_NAME: optionalString,

  REDIS_HOST: optionalString.hostname(),
  REDIS_PORT: optionalNumber.port().when('REDIS_HOST', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  REDIS_USERNAME: optionalString,
  REDIS_PASSWORD: optionalString,

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES: optionalNumber.integer().positive().default(1800),
  JWT_REFRESH_EXPIRES: optionalNumber.integer().positive().default(604800),

  ALLOWED_ORIGINS: Joi.string()
    .trim()
    .default('http://localhost:3000')
    .custom(validateAllowedOrigins),
  THROTTLE_TTL: optionalNumber.integer().positive().default(60000),
  THROTTLE_LIMIT: optionalNumber.integer().positive().default(100),
  OSRM_URL: optionalString
    .uri({ scheme: ['http', 'https'] })
    .default('http://localhost:5000'),

  COOKIE_SECURE: Joi.boolean().truthy('true').falsy('false').default(false),
  CSRF_ENABLED: Joi.boolean().truthy('true').falsy('false').default(true),
  STORAGE_SIGNED_URL_TTL_SECONDS: optionalNumber
    .integer()
    .positive()
    .default(300),
}).unknown(true);

export function validateEnv(
  config: Record<string, unknown>,
): ValidatedEnvironment {
  const preparedConfig = withInferredAppEnv(config);
  const validationResult: Joi.ValidationResult<ValidatedEnvironment> =
    envValidationSchema.validate(preparedConfig, {
      abortEarly: false,
      allowUnknown: true,
      convert: true,
    });

  if (validationResult.error) {
    throw new Error(formatValidationError(validationResult.error));
  }

  const validated = validationResult.value;
  enforceProductionRules(validated);

  return validated;
}

function withInferredAppEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const nodeEnv = readNonEmptyString(config.NODE_ENV) ?? 'development';
  const appEnv = readNonEmptyString(config.APP_ENV) ?? inferAppEnv(nodeEnv);

  return {
    ...config,
    NODE_ENV: nodeEnv,
    APP_ENV: appEnv,
  };
}

function inferAppEnv(nodeEnv: string): AppEnvironment {
  if (nodeEnv === 'production') {
    return 'production';
  }

  if (nodeEnv === 'test') {
    return 'ci';
  }

  return 'local';
}

function validateAllowedOrigins(
  value: string,
  helpers: Joi.CustomHelpers,
): string {
  const origins = splitCsv(value);
  const invalidOrigin = origins.find((origin) => {
    if (origin === '*') {
      return false;
    }

    return !isHttpUrl(origin);
  });

  if (invalidOrigin) {
    return helpers.error('any.invalid', { value: invalidOrigin }) as never;
  }

  return value;
}

function enforceProductionRules(env: ValidatedEnvironment): void {
  if (env.APP_ENV !== 'production') {
    return;
  }

  const errors: string[] = [];

  if (env.NODE_ENV !== 'production') {
    errors.push('NODE_ENV must be production when APP_ENV=production');
  }

  if (!isHttpsUrl(env.APP_BASE_URL)) {
    errors.push('APP_BASE_URL must be an https URL when APP_ENV=production');
  }

  if (!env.COOKIE_SECURE) {
    errors.push('COOKIE_SECURE must be true when APP_ENV=production');
  }

  if (env.JWT_SECRET.length < 48) {
    errors.push(
      'JWT_SECRET must be at least 48 characters when APP_ENV=production',
    );
  }

  const unsafeOrigins = splitCsv(env.ALLOWED_ORIGINS).filter(
    isUnsafeProductionOrigin,
  );

  if (unsafeOrigins.length > 0) {
    errors.push(
      `ALLOWED_ORIGINS contains unsafe production origin(s): ${unsafeOrigins.join(', ')}`,
    );
  }

  if (errors.length > 0) {
    throw new Error(`Config validation failed:\n- ${errors.join('\n- ')}`);
  }
}

function formatValidationError(error: Joi.ValidationError): string {
  return `Config validation failed:\n- ${error.details
    .map((detail) => detail.message)
    .join('\n- ')}`;
}

function readNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isHttpsUrl(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isUnsafeProductionOrigin(origin: string): boolean {
  if (origin === '*') {
    return true;
  }

  try {
    const url = new URL(origin);
    return (
      url.protocol !== 'https:' ||
      ['localhost', '127.0.0.1', '0.0.0.0'].includes(url.hostname)
    );
  } catch {
    return true;
  }
}
