import { AdminRole } from '../enums/admin-role.enum';

export interface CurrentAdminData {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
