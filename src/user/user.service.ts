import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { RoleEnum } from 'src/role/models/role.model';
import { RoleService } from 'src/role/role.service';
import { ApiError } from 'src/shared/api-error';
import { ErrorCodes } from 'src/shared/error-codes';
import { downloadFile } from 'src/shared/file-upload-download.utils';
import { hashPassword } from 'src/shared/hash-password';
import { Token } from 'src/shared/token.request';
import { UserRepository } from 'src/user/user.repository';
import { Not } from 'typeorm';
import { promisify } from 'util';

import { UserCreateDTO } from './models/dto/user-create.dto';
import { UserUpdateAddressDTO } from './models/dto/user-update-address.dto';
import { UserUpdateDTO } from './models/dto/user-update.dto';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleService: RoleService,
  ) {}

  async getAll(): Promise<User[]> {
    const users = await this.userRepository.findSafe({
      relations: ['role'],
    });

    return users;
  }

  async get(id: number, token: Token): Promise<User> {
    if (token.role !== RoleEnum.admin && token.id !== id) {
      throw new ForbiddenException(ErrorCodes.YOU_CAN_SEE_ONLY_YOUR_PROFILE);
    }

    const user = await this.findOne({ id }, { withRole: true });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async downloadUserImage(
    id: number,
    response: Response,
    token: Token,
  ): Promise<any> {
    if (token.role !== RoleEnum.admin && token.id !== id) {
      throw new ForbiddenException(ErrorCodes.YOU_CAN_SEE_ONLY_YOUR_PROFILE);
    }

    const user = await this.findOne({ id });
    if (!user?.picture) {
      throw new NotFoundException();
    }

    return await downloadFile(user.picture, response);
  }

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

  async create(userDTO: UserCreateDTO): Promise<User> {
    // Check email existence
    const countEmails = await this.userRepository.countSafe({
      where: { email: userDTO.email },
    });
    if (countEmails) {
      throw new ApiError(400, ErrorCodes.EMAIL_ALREADY_EXISTS);
    }

    // Find role
    const role = await this.roleService.findOneById(userDTO.roleId);
    if (!role || role.name === RoleEnum.student) {
      throw new ApiError(400, ErrorCodes.INVALID_ROLE);
    }

    const user = new User();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.personalId = userDTO.personalId;
    user.email = userDTO.email;
    if (userDTO.address) {
      user.address = userDTO.address;
    }
    user.password = await hashPassword(userDTO.password);
    user.role = role;

    return await this.userRepository.save(user);
  }

  async update(id: number, userDTO: UserUpdateDTO): Promise<User> {
    const user = await this.findOne({ id }, { withRole: true });
    if (!user) {
      throw new NotFoundException();
    }

    // Find role
    if (userDTO.roleId) {
      const role = await this.roleService.findOneById(userDTO.roleId);
      if (!role || role.name === RoleEnum.student) {
        throw new ApiError(400, ErrorCodes.INVALID_ROLE);
      }
      user.role = role;
    }
    if (userDTO.firstName) {
      user.firstName = userDTO.firstName;
    }
    if (userDTO.lastName) {
      user.lastName = userDTO.lastName;
    }
    if (userDTO.personalId) {
      user.personalId = userDTO.personalId;
    }
    if (userDTO.email) {
      // Check email existence
      const countEmails = await this.userRepository.countSafe({
        where: { id: Not(id), email: userDTO.email },
      });
      if (countEmails) {
        throw new ApiError(400, ErrorCodes.EMAIL_ALREADY_EXISTS);
      }
      user.email = userDTO.email;
    }
    if (userDTO.password) {
      user.password = await hashPassword(userDTO.password);
    }
    if (userDTO.address !== undefined) {
      user.address = userDTO.address;
    }

    return await this.userRepository.save(user);
  }

  async updateAddressAndImage(
    imagePath: string,
    userDTO: UserUpdateAddressDTO,
    token: Token,
  ): Promise<User> {
    const user = await this.findOne({ id: token.id }, { withRole: true });
    if (!user) {
      throw new NotFoundException();
    }

    if (userDTO.address !== undefined) {
      user.address = userDTO.address;
    }
    if (imagePath) {
      if (user.picture) {
        try {
          await promisify(fs.unlink)(user.picture);
        } catch {}
      }
      user.picture = imagePath;
    }

    return await this.userRepository.save(user);
  }

  async delete(id: number, token: Token): Promise<void> {
    if (token.id === id) {
      throw new ForbiddenException(ErrorCodes.CANNOT_DELETE_YOURSELF);
    }

    const user = await this.userRepository.findOneSafe(id);
    if (!user) {
      throw new NotFoundException();
    }

    await this.userRepository.removeSafe(id, user);
  }
}
