import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { serializeAdminProfile } from '../../common/serializers/admin.serializer';
import { Admin } from '../../entities';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminsRepository: Repository<Admin>,
  ) {}

  async getProfile(adminId: string) {
    const admin = await this.adminsRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin profile not found.');
    }

    return serializeAdminProfile(admin);
  }
}
