import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

const transformBoolean = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return value;
};

export class PublicProductsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  categorySlug?: string;

  @IsOptional()
  @Transform(transformBoolean)
  @IsBoolean()
  featured?: boolean;
}
