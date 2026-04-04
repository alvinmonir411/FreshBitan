import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { serializeAdminProfile } from '../../../common/serializers/admin.serializer';
import { Admin } from '../../../entities';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {
    const jwtSecret = configService.get<string>('auth.jwtSecret');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is required for authentication.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const admin = await this.adminsRepository.findOne({
      where: {
        id: payload.sub,
        isActive: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin account is not authorized.');
    }

    return serializeAdminProfile(admin);
  }
}
