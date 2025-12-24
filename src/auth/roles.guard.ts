import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { UserRoleInternal } from '@prisma/client';
  import { ROLES_KEY } from './roles.decorator';
  import { JwtPayload } from './auth.types';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      // welche Rollen sind gefordert?
      const requiredRoles =
        this.reflector.getAllAndOverride<UserRoleInternal[]>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
  
      // wenn nichts angegeben → keine Rollenprüfung
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user as JwtPayload | undefined;
      if (!user) {
        return false;
      }
  
      // nur interne Nutzer dürfen durch diesen Guard
      if (user.type !== 'internal') {
        return false;
      }
  
      return requiredRoles.includes(user.role as UserRoleInternal);
    }
  }
  