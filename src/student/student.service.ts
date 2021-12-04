import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { BookRequestStatus } from 'src/book-request/models/book-request.model';
import { RoleEnum } from 'src/role/models/role.model';
import { RoleService } from 'src/role/role.service';
import { ApiError } from 'src/shared/api-error';
import { ErrorCodes } from 'src/shared/error-codes';
import { hashPassword } from 'src/shared/hash-password';
import { Token } from 'src/shared/token.request';
import { StudentRepository } from 'src/student/student.repository';

import { StudentCreateDTO } from './model/dto/student-create.dto';
import { UpdatePasswordDTO } from './model/dto/student-update-password.dto';
import { StudentUpdateDTO } from './model/dto/student-update.dto';
import { Student } from './model/student.model';

@Injectable()
export class StudentService {
  constructor(
    private studentRepository: StudentRepository,
    private roleService: RoleService,
  ) {}

  async getAll(): Promise<Student[]> {
    const students = await this.studentRepository.findSafe({
      relations: ['role'],
    });

    return students;
  }

  async get(id: number, token: Token): Promise<Student> {
    if (token.isStudent && token.id !== id) {
      throw new ForbiddenException(ErrorCodes.YOU_CAN_SEE_ONLY_YOUR_PROFILE);
    }

    const student = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect(
        'student.bookRequests',
        'bookRequest',
        'bookRequest.deleted_at IS NULL',
      )
      .leftJoinAndSelect('bookRequest.book', 'book')
      .where('student.deleted_at IS NULL')
      .andWhere('student.id = :id', { id })
      .getOne();
    if (!student) {
      throw new NotFoundException();
    }

    return student;
  }

  async findOne(
    by: { email?: string; id?: number },
    options: { withPassword?: boolean; withRole?: boolean } = {
      withPassword: false,
      withRole: false,
    },
  ): Promise<Student | undefined> {
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

    const student = await this.studentRepository.findOneSafe({
      where,
      relations,
    });

    if (student && !withPassword) {
      delete student.password;
    }

    return student;
  }

  async create(studentDTO: StudentCreateDTO): Promise<Student> {
    const student = new Student();
    student.firstName = studentDTO.firstName;
    student.lastName = studentDTO.lastName;
    student.personalId = studentDTO.personalId;
    student.email = studentDTO.email;
    student.password = await hashPassword(studentDTO.password);
    student.role = await this.roleService.findOneByName(RoleEnum.student); // For now, each student will have STUDENT role

    return await this.studentRepository.save(student);
  }

  async update(id: number, studentDTO: StudentUpdateDTO): Promise<Student> {
    const student = await this.studentRepository.findOneSafe(id, {
      relations: ['role'],
    });
    if (!student) {
      throw new NotFoundException();
    }

    if (studentDTO.firstName) {
      student.firstName = studentDTO.firstName;
    }
    if (studentDTO.lastName) {
      student.lastName = studentDTO.lastName;
    }
    if (studentDTO.personalId) {
      student.personalId = studentDTO.personalId;
    }
    if (studentDTO.email) {
      student.email = studentDTO.email;
    }
    if (studentDTO.password) {
      student.password = await hashPassword(studentDTO.password);
    }

    return await this.studentRepository.save(student);
  }

  async updatePassword(
    updatePasswordDTO: UpdatePasswordDTO,
    token: Token,
  ): Promise<void> {
    const student = await this.studentRepository.findOneSafe(token.id);
    if (!student) {
      throw new NotFoundException();
    }

    const validPassword = await bcrypt.compare(
      updatePasswordDTO.oldPassword,
      student.password,
    );
    if (!validPassword) {
      throw new ApiError(400, ErrorCodes.INVALID_OLD_PASSWORD);
    }

    student.password = await hashPassword(updatePasswordDTO.newPassword);
    await this.studentRepository.save(student);
  }

  async delete(id: number): Promise<void> {
    const student = await this.studentRepository.findOneSafe(id, {
      relations: ['bookRequests'],
    });
    if (!student) {
      throw new NotFoundException();
    }

    // Do not allow to delete student if he has any unreturned book
    if (
      student.bookRequests.filter(
        (br) =>
          br.deletedDate === null &&
          br.requestStatus === BookRequestStatus.accepted &&
          br.returnRequestStatus === null,
      ).length
    ) {
      throw new ApiError(400, ErrorCodes.CANNOT_DELETE_BOOK_ISSUED);
    }

    await this.studentRepository.removeSafe(id, student);
  }
}
