import { Injectable } from '@nestjs/common';
import { Student } from 'src/models/student.model';
import { StudentRepository } from 'src/repositories/student.repository';

@Injectable()
export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

  async findOne(
    email: string,
    options: { withPassword: boolean } = { withPassword: false },
  ): Promise<Student | undefined> {
    const student = await this.studentRepository.findOneSafe({
      where: { email },
    });

    if (student && !options.withPassword) {
      delete student.password;
    }

    return student;
  }
}
