import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { serializeAdminProfile } from '../../common/serializers/admin.serializer';
import { Admin } from '../../entities';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { comparePassword } from './utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const admin = await this.adminsRepository
      .createQueryBuilder('admin')
      .addSelect('admin.passwordHash')
      .where('LOWER(admin.email) = LOWER(:email)', { email: loginDto.email })
      .getOne();

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatches = await comparePassword(
      loginDto.password,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    admin.lastLoginAt = new Date();
    await this.adminsRepository.save(admin);

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      admin: serializeAdminProfile(admin),
    };
  }
}
