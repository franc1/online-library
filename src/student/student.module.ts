import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { RoleModule } from 'src/role/role.module';
import { StudentRepository } from 'src/student/student.repository';

import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentRepository]),
    RoleModule,
    MailModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
