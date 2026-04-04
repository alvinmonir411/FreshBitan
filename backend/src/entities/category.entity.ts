import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../common/entities/base.entity';
import { Product } from './product.entity';

@Entity({ name: 'categories' })
export class Category extends AppBaseEntity {
  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @OneToMany(() => Product, (product) => product.category)
  products!: Product[];
}
