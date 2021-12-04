import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/decorators/roles.decorator';
import { TokenParam } from 'src/decorators/token.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';
import { Token } from 'src/shared/token.request';

import { UserCreateDTO } from './models/dto/user-create.dto';
import { UserUpdateDTO } from './models/dto/user-update.dto';
import { User } from './models/user.model';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('user')
@ApiBadRequestResponse({
  type: ErrorResponse,
})
@ApiUnauthorizedResponse({
  type: ErrorResponse,
})
@ApiForbiddenResponse({
  type: ErrorResponse,
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles([RoleEnum.admin])
  @Get()
  async getAll(): Promise<User[]> {
    const users = await this.userService.getAll();

    return plainToClass(User, users);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Get(':id')
  async get(
    @Param('id', ParseIntPipe) id: number,
    @TokenParam() token: Token,
  ): Promise<User> {
    const user = await this.userService.get(id, token);

    return plainToClass(User, user);
  }

  @Roles([RoleEnum.admin])
  @Post()
  async create(@Body() userDTO: UserCreateDTO): Promise<User> {
    const user = await this.userService.create(userDTO);

    return plainToClass(User, user);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDTO: UserUpdateDTO,
    @TokenParam() token: Token,
  ): Promise<User> {
    const user = await this.userService.update(id, userDTO, token);

    return plainToClass(User, user);
  }

  @Roles([RoleEnum.admin])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @TokenParam() token: Token,
  ): Promise<void> {
    await this.userService.delete(id, token);
  }
}
