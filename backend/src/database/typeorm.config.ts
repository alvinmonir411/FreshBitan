import { ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DATABASE_ENTITIES } from '../entities';

export const createTypeOrmOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('database.url');
  const synchronize = configService.get<boolean>('database.synchronize', false);
  const logging = configService.get<boolean>('database.logging', false);
  const ssl = configService.get<boolean | { rejectUnauthorized: false }>(
    'database.ssl',
    {
      rejectUnauthorized: false,
    },
  );

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to initialize TypeORM.');
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    entities: DATABASE_ENTITIES,
    synchronize,
    logging,
    ssl,
  };
};

export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    createTypeOrmOptions(configService),
};
