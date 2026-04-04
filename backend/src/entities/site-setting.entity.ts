import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../common/entities/base.entity';

@Entity({ name: 'site_settings' })
export class SiteSetting extends AppBaseEntity {
  @Column({ type: 'varchar', length: 120, unique: true })
  key!: string;

  @Column({ type: 'text', nullable: true })
  value!: string | null;

  @Column({ type: 'varchar', length: 50, default: 'text' })
  type!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  label!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'boolean', default: false })
  isPublic!: boolean;
}
