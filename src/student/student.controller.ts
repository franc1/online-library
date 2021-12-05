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
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Public } from 'src/decorators/public-route.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { TokenParam } from 'src/decorators/token.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';
import { Token } from 'src/shared/token.request';

import { StudentCompleteRegistrationDTO } from './model/dto/student-complete-registration.dto';
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
  @Get()
  async getAll(): Promise<Student[]> {
    const students = await this.studentService.getAll();

    return plainToClass(Student, students);
  }

  @Roles([RoleEnum.librarian, RoleEnum.student])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Get(':id')
  async get(
    @Param('id', ParseIntPipe) id: number,
    @TokenParam() token: Token,
  ): Promise<Student> {
    const student = await this.studentService.get(id, token);

    return plainToClass(Student, student);
  }

  @ApiSecurity({})
  @Public()
  @Post('register')
  async initRegistration(@Body() studentDTO: StudentCreateDTO): Promise<void> {
    await this.studentService.initRegistration(studentDTO);
  }

  @ApiSecurity({})
  @Public()
  @Patch('complete-registration')
  async completeRegistration(
    @Body() studentCompleteRegistrationDTO: StudentCompleteRegistrationDTO,
  ): Promise<void> {
    await this.studentService.completeRegistration(
      studentCompleteRegistrationDTO,
    );
  }

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

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.studentService.delete(id);
  }
}
