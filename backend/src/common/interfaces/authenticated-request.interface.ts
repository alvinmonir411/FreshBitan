import { Request } from 'express';
import { CurrentAdminData } from './current-admin.interface';

export interface AuthenticatedRequest extends Request {
  user: CurrentAdminData;
}
