import { AdminRole } from '../enums/admin-role.enum';

export const FULL_ADMIN_ACCESS_ROLES = [
  AdminRole.SUPER_ADMIN,
  AdminRole.ADMIN,
  AdminRole.MANAGER,
] as const;
