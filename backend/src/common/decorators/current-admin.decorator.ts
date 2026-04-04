import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { CurrentAdminData } from '../interfaces/current-admin.interface';

export const CurrentAdmin = createParamDecorator(
  (
    data: keyof CurrentAdminData | undefined,
    context: ExecutionContext,
  ): CurrentAdminData | CurrentAdminData[keyof CurrentAdminData] => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const currentAdmin = request.user;

    return data ? currentAdmin[data] : currentAdmin;
  },
);
