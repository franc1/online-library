import { Role } from 'src/role/models/role.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(Role)
export class RoleRepository extends BaseRepository<Role> {}
