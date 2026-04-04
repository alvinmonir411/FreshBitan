import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { FULL_ADMIN_ACCESS_ROLES } from '../../common/constants/admin-roles.constant';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public')
  getPublicSettings() {
    return this.settingsService.findPublic();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...FULL_ADMIN_ACCESS_ROLES)
  getAdminSettings() {
    return this.settingsService.findAll();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...FULL_ADMIN_ACCESS_ROLES)
  updateSettings(@Body() updateSiteSettingsDto: UpdateSiteSettingsDto) {
    return this.settingsService.update(updateSiteSettingsDto);
  }
}
