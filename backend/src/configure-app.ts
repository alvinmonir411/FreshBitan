import { ConfigService } from '@nestjs/config';
import { ValidationPipe, INestApplication } from '@nestjs/common';

export function configureNestApp(app: INestApplication) {
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api');
  const nodeEnv = configService.get<string>('nodeEnv', 'development');
  const frontendUrl = configService.get<string>(
    'app.frontendUrl',
    'http://localhost:3000',
  );

  const allowedOrigins = frontendUrl
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({
    origin:
      nodeEnv === 'production'
        ? allowedOrigins
        : allowedOrigins.length > 0
          ? allowedOrigins
          : true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableShutdownHooks();

  return configService;
}
