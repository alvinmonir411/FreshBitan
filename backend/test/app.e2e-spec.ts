import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';
import { HealthController } from './../src/modules/health/health.controller';
import { HealthService } from './../src/modules/health/health.service';

interface HealthResponseBody {
  status: string;
  service: string;
  timestamp: string;
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, fallback?: string) => {
              if (key === 'app.name') {
                return 'FreshBitan API';
              }

              if (key === 'app.apiPrefix') {
                return 'api';
              }

              if (key === 'app.frontendUrl') {
                return 'http://localhost:3000';
              }

              return fallback;
            },
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    const configService = app.get(ConfigService);

    app.setGlobalPrefix(configService.get<string>('app.apiPrefix', 'api'));
    app.enableCors({
      origin: configService.get<string>(
        'app.frontendUrl',
        'http://localhost:3000',
      ),
      credentials: true,
    });
    await app.init();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(({ body }: { body: HealthResponseBody }) => {
        expect(body.status).toBe('ok');
        expect(body.service).toBe('FreshBitan API');
        expect(body.timestamp).toEqual(expect.any(String));
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
