import { User } from 'src/user/models/user.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../shared/repositories/base.repository';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {}
