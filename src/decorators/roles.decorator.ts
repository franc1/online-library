import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RoleEnum } from 'src/role/models/role.model';

export const ROLES_KEY = 'roles';

export interface IRolesOptions {
  disallowAdmin?: boolean;
}

// The admin is allowed access in each case, unless explicitly requested otherwise through the 'options'
// Other roles should be passed as argument in 'roles' array
export function Roles(
  roles: RoleEnum[],
  options: IRolesOptions = { disallowAdmin: false },
) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, { roles, options }),
    UseGuards(RolesGuard),
  );
}
