import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSetting } from '../../entities';
import {
  UpdateSiteSettingItemDto,
  UpdateSiteSettingsDto,
} from './dto/update-site-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteSetting)
    private readonly siteSettingsRepository: Repository<SiteSetting>,
  ) {}

  findPublic() {
    return this.siteSettingsRepository.find({
      where: {
        isPublic: true,
      },
      order: {
        key: 'ASC',
      },
    });
  }

  findAll() {
    return this.siteSettingsRepository.find({
      order: {
        key: 'ASC',
      },
    });
  }

  async update(updateSiteSettingsDto: UpdateSiteSettingsDto) {
    const updatedSettings: SiteSetting[] = [];

    for (const item of updateSiteSettingsDto.settings) {
      const setting = await this.upsertSetting(item);
      updatedSettings.push(setting);
    }

    return updatedSettings;
  }

  private async upsertSetting(item: UpdateSiteSettingItemDto) {
    const existingSetting = await this.siteSettingsRepository.findOne({
      where: {
        key: item.key,
      },
    });

    const setting =
      existingSetting ?? this.siteSettingsRepository.create({ key: item.key });

    setting.value = item.value ?? setting.value ?? null;
    setting.type = item.type ?? setting.type ?? 'text';
    setting.label = item.label ?? setting.label ?? null;
    setting.description = item.description ?? setting.description ?? null;
    setting.isPublic = item.isPublic ?? setting.isPublic ?? false;

    return this.siteSettingsRepository.save(setting);
  }
}
