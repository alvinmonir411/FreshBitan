import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureNestApp } from './configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = configureNestApp(app) as ConfigService;
  const port = configService.get<number>('app.port', 4002);

  await app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
  });
}
void bootstrap();
