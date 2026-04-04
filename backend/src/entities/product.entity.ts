import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../common/entities/base.entity';
import { numericColumnTransformer } from '../common/transformers/numeric-column.transformer';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { Review } from './review.entity';

@Entity({ name: 'products' })
export class Product extends AppBaseEntity {
  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ type: 'varchar', length: 180, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  shortDescription!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

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

  @Column({ type: 'varchar', length: 80, unique: true, nullable: true })
  sku!: string | null;

  @Column({ type: 'int', default: 0 })
  stockQuantity!: number;

  @Column({ type: 'varchar', length: 30, default: 'kg' })
  unit!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  origin!: string | null;

  @Column({ type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'uuid', nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category!: Category | null;

  @OneToMany(() => ProductImage, (image) => image.product)
  images!: ProductImage[];

  @OneToMany(() => Review, (review) => review.product)
  reviews!: Review[];
}
