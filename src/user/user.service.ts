import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(
    email: string,
    options: { withPassword?: boolean; withRole?: boolean } = {
      withPassword: false,
      withRole: false,
    },
  ): Promise<User | undefined> {
    const { withPassword, withRole } = options;

    const relations: string[] = [];
    if (withRole) {
      relations.push('role');
    }
    const user = await this.userRepository.findOneSafe({
      where: { email },
      relations,
    });

    if (user && !withPassword) {
      delete user.password;
    }

    return user;
  }
}
