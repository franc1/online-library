import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findOne(
    email: string,
    options: { withPassword: boolean } = { withPassword: false },
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOneSafe({
      where: { email },
    });

    if (user && !options.withPassword) {
      delete user.password;
    }

    return user;
  }
}
