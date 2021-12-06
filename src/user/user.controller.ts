import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { diskStorage } from 'multer';
import { Roles } from 'src/decorators/roles.decorator';
import { TokenParam } from 'src/decorators/token.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';
import { editFileName, imageFileFilter } from 'src/shared/file-upload.utils';
import { Token } from 'src/shared/token.request';

import { UserCreateDTO } from './models/dto/user-create.dto';
import { UserUpdateAddressDTO } from './models/dto/user-update-address.dto';
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

  // Any librarian/admin can update address/image for himself
  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        address: { type: 'string' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'dist/files/student/',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Patch('personal-data')
  async updateAddressAndImage(
    @UploadedFile() image: Express.Multer.File,
    @Body() userDTO: UserUpdateAddressDTO,
    @TokenParam() token: Token,
  ): Promise<User> {
    const user = await this.userService.updateAddressAndImage(
      image?.path,
      userDTO,
      token,
    );

    return plainToClass(User, user);
  }

  @Roles([RoleEnum.admin])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() userDTO: UserUpdateDTO,
  ): Promise<User> {
    const user = await this.userService.update(id, userDTO);

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
