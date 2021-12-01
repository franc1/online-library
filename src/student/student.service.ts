import { Injectable } from '@nestjs/common';
import { Student } from 'src/models/student.model';
import { StudentRepository } from 'src/repositories/student.repository';

@Injectable()
export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

  async findOne(
    email: string,
    options: { withPassword?: boolean; withRole?: boolean } = {
      withPassword: false,
      withRole: false,
    },
  ): Promise<Student | undefined> {
    const { withPassword, withRole } = options;

    const relations: string[] = [];
    if (withRole) {
      relations.push('role');
    }

    const student = await this.studentRepository.findOneSafe({
      where: { email },
      relations,
    });

    if (student && !withPassword) {
      delete student.password;
    }

    return student;
  }
}
