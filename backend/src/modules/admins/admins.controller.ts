import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FULL_ADMIN_ACCESS_ROLES } from '../../common/constants/admin-roles.constant';
import type { CurrentAdminData } from '../../common/interfaces/current-admin.interface';
import { AdminsService } from './admins.service';

@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...FULL_ADMIN_ACCESS_ROLES)
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get('me')
  getMe(@CurrentAdmin() currentAdmin: CurrentAdminData) {
    return this.adminsService.getProfile(currentAdmin.id);
  }
}
