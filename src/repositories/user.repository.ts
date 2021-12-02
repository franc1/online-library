import { User } from 'src/user/models/user.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {}
