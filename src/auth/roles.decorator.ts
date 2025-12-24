import { SetMetadata } from '@nestjs/common';
import { UserRoleInternal } from '@prisma/client';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoleInternal[]) =>
  SetMetadata(ROLES_KEY, roles);
