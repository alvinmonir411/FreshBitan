import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, fallback?: string) =>
              key === 'app.name' ? 'FreshBitan API' : fallback,
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('returns a healthy response payload', () => {
    const response = service.getHealth();

    expect(response.status).toBe('ok');
    expect(response.service).toBe('FreshBitan API');
    expect(response.timestamp).toEqual(expect.any(String));
  });
});
