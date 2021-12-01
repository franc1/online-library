import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RoleEnum } from 'src/models/role.model';

export const ROLES_KEY = 'roles';

export interface IRolesOptions {
  disallowAdmin?: boolean;
}

export function Roles(
  roles: RoleEnum[],
  options: IRolesOptions = { disallowAdmin: false },
) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, { roles, options }),
    UseGuards(RolesGuard),
  );
}
