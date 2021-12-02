import { Student } from 'src/student/model/student.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../shared/repositories/base.repository';

@EntityRepository(Student)
export class StudentRepository extends BaseRepository<Student> {}
