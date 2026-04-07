import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../common/entities/base.entity';
import { numericColumnTransformer } from '../common/transformers/numeric-column.transformer';
import { Product } from './product.entity';

@Entity({ name: 'product_options' })
export class ProductOption extends AppBaseEntity {
  @Column({ type: 'uuid' })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'varchar', length: 80 })
  label!: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericColumnTransformer,
  })
  price!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: numericColumnTransformer,
  })
  discountedPrice!: number | null;

  @Column({ type: 'int', default: 0 })
  stockQuantity!: number;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ type: 'boolean', default: false })
  isDefault!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;
}
