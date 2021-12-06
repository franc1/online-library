import { Injectable } from '@nestjs/common';

import { Role, RoleEnum } from './models/role.model';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async getAll(): Promise<Role[]> {
    return await this.roleRepository.findSafe();
  }

  async findOneByName(roleName: RoleEnum): Promise<Role> {
    return await this.roleRepository.findOneSafe({ where: { name: roleName } });
  }

  async findOneById(id: number): Promise<Role> {
    return await this.roleRepository.findOneSafe(id);
  }
}
