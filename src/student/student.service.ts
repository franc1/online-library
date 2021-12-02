import { Injectable } from '@nestjs/common';
import { StudentRepository } from 'src/repositories/student.repository';

import { Student } from './model/student.model';

@Injectable()
export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

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
}
