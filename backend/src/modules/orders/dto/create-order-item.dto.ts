import { IsInt, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  productId!: string;

  @IsOptional()
  @IsUUID()
  productOptionId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
