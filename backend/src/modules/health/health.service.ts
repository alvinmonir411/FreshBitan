import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok' as const,
      service: this.configService.get<string>('app.name', 'FreshBitan API'),
      timestamp: new Date().toISOString(),
    };
  }
}
