import dns from 'node:dns';
// Fix: Node.js c-ares DNS trỏ về 127.0.0.1 → SRV lookup thất bại
// Đặt Google + Cloudflare DNS để mongodb+srv:// hoạt động
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const apiBasePath = configService.get<string>('API_BASE_PATH', '/api/v1');
  const globalPrefix = apiBasePath.replace(/^\/+/, '');
  app.setGlobalPrefix(globalPrefix);
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filter + interceptor
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // CORS
  const origins = configService.get<string>('ALLOWED_ORIGINS', '');
  app.enableCors({
    origin: origins.split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ve Xe Nhanh API')
    .setDescription('Tài liệu api Vé Xe Nhanh')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT')!;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}/${globalPrefix}`);
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('Lỗi trong quá trình khởi động server:', err);
  process.exit(1);
});
