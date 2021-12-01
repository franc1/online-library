import { Request } from 'express';
import { Student } from 'src/models/student.model';
import { User } from 'src/models/user.model';

export interface DMSRequest extends Request {
  user: User | Student;
}
