import { Student } from 'src/student/model/student.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(Student)
export class StudentRepository extends BaseRepository<Student> {}
