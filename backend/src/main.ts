import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureNestApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = configureNestApp(app) as ConfigService;
  const port = configService.get<number>('app.port', 4000);

  await app.listen(port);
}
void bootstrap();
