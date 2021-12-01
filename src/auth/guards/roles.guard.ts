import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public-route.decorator';
import { IRolesOptions, ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role, RoleEnum } from 'src/models/role.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { roles: requiredSomeOfRoles, options } = this.reflector.get<{
      roles: RoleEnum[];
      options: IRolesOptions;
    }>(ROLES_KEY, context.getHandler());
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Allow - if route is public
    if (isPublic) {
      return true;
    }

    const { disallowAdmin } = options;
    const request = context.switchToHttp().getRequest();
    const userRole = request?.user?.role as Role;

    // Doesn't allow - if userRole doesn't exist, or if admin is attempting to use route he is not allowed
    if (!userRole || (disallowAdmin && userRole.name === RoleEnum.admin)) {
      return false;
    }

    // Allow - if @Roles decorator contains no roles, or if admin is logged in
    if (
      !requiredSomeOfRoles ||
      requiredSomeOfRoles.length === 0 ||
      userRole.name === RoleEnum.admin
    ) {
      return true;
    }

    // Check if userRole belongs to some of required roles from @Roles decorator
    for (const role of requiredSomeOfRoles) {
      if (userRole.name === role) {
        return true;
      }
    }

    return false;
  }
}
