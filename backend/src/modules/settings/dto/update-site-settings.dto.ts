import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSiteSettingItemDto {
  @IsString()
  @MaxLength(120)
  key!: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  label?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateSiteSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSiteSettingItemDto)
  settings!: UpdateSiteSettingItemDto[];
}
