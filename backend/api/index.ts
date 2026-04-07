import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { configureNestApp } from '../src/configure-app';

let cachedHandler: ((req: any, res: any) => void) | null = null;

async function createHandler() {
  const adapter = new ExpressAdapter();
  const app = await NestFactory.create(AppModule, adapter);

  configureNestApp(app);
  await app.init();

  return adapter.getInstance();
}

export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    cachedHandler = await createHandler();
  }

  return cachedHandler!(req, res);
}
