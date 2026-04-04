import { Column, Entity } from 'typeorm';
import { AppBaseEntity } from '../common/entities/base.entity';
import { AdminRole } from '../common/enums/admin-role.enum';

@Entity({ name: 'admins' })
export class Admin extends AppBaseEntity {
  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
    enumName: 'admin_role_enum',
    default: AdminRole.ADMIN,
  })
  role!: AdminRole;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt!: Date | null;
}
