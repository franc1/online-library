import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/decorators/roles.decorator';
import { ErrorResponse } from 'src/shared/error.response';

import { Role, RoleEnum } from './models/role.model';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('role')
@ApiBadRequestResponse({
  type: ErrorResponse,
})
@ApiUnauthorizedResponse({
  type: ErrorResponse,
})
@ApiForbiddenResponse({
  type: ErrorResponse,
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles([RoleEnum.admin])
  @Get()
  async getAll(): Promise<Role[]> {
    const roles = await this.roleService.getAll();

    return plainToClass(Role, roles);
  }
}
