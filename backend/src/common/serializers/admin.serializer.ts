import { CurrentAdminData } from '../interfaces/current-admin.interface';
import { Admin } from '../../entities';

export const serializeAdminProfile = (
  admin: Pick<
    Admin,
    | 'id'
    | 'name'
    | 'email'
    | 'role'
    | 'phone'
    | 'isActive'
    | 'lastLoginAt'
    | 'createdAt'
    | 'updatedAt'
  >,
): CurrentAdminData => ({
  id: admin.id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  phone: admin.phone,
  isActive: admin.isActive,
  lastLoginAt: admin.lastLoginAt,
  createdAt: admin.createdAt,
  updatedAt: admin.updatedAt,
});
