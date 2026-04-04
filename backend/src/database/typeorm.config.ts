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

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to initialize TypeORM.');
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    entities: DATABASE_ENTITIES,
    synchronize: true,
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  };
};

export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) =>
    createTypeOrmOptions(configService),
};
