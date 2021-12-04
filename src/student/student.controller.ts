import {
  Body,
  Controller,
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

import { StudentCreateDTO } from './model/dto/student-create.dto';
import { UpdatePasswordDTO } from './model/dto/student-update-password.dto';
import { StudentUpdateDTO } from './model/dto/student-update.dto';
import { Student } from './model/student.model';
import { StudentService } from './student.service';

@Controller('student')
@ApiTags('student')
@ApiBadRequestResponse({
  type: ErrorResponse,
})
@ApiUnauthorizedResponse({
  type: ErrorResponse,
})
@ApiForbiddenResponse({
  type: ErrorResponse,
})
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Roles([RoleEnum.librarian])
  @Post()
  async create(@Body() studentDTO: StudentCreateDTO): Promise<Student> {
    const student = await this.studentService.create(studentDTO);

    return plainToClass(Student, student);
  }

  // Only student (for himself) can change passwor
  @Roles([RoleEnum.student], { disallowAdmin: true })
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch('update-password')
  async updatePassword(
    @Body() updatePasswordDTO: UpdatePasswordDTO,
    @TokenParam() token: Token,
  ): Promise<void> {
    await this.studentService.updatePassword(updatePasswordDTO, token);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() studentDTO: StudentUpdateDTO,
  ): Promise<Student> {
    const student = await this.studentService.update(id, studentDTO);

    return plainToClass(Student, student);
  }
}
