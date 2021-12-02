import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';

import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(
    by: { email?: string; id?: number },
    options: { withPassword?: boolean; withRole?: boolean } = {
      withPassword: false,
      withRole: false,
    },
  ): Promise<User | undefined> {
    const { withPassword, withRole } = options;
    const { email, id } = by;

    // Email or Id should be sent always!!
    if (!email && !id) {
      return null;
    }

    const relations: string[] = [];
    if (withRole) {
      relations.push('role');
    }

    const where: any = {};
    if (id) {
      where.id = id;
    } else if (email) {
      where.email = email;
    }

    const user = await this.userRepository.findOneSafe({
      where,
      relations,
    });

    if (user && !withPassword) {
      delete user.password;
    }

    return user;
  }
}
