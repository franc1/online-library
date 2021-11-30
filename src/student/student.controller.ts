import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { StudentService } from './student.service';

@Controller('student')
@ApiTags('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
}
