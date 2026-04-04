import { Check, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../common/entities/base.entity';
import { Product } from './product.entity';

@Entity({ name: 'reviews' })
@Check('"rating" >= 1 AND "rating" <= 5')
export class Review extends AppBaseEntity {
  @Column({ type: 'uuid' })
  productId!: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column({ type: 'varchar', length: 120 })
  customerName!: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  customerEmail!: string | null;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string | null;

  @Column({ type: 'boolean', default: false })
  isApproved!: boolean;
}
