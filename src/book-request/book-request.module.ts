import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from 'src/book/book.module';
import { StudentModule } from 'src/student/student.module';
import { UserModule } from 'src/user/user.module';

import { BookRequestController } from './book-request.controller';
import { BookRequestRepository } from './book-request.repository';
import { BookRequestService } from './book-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookRequestRepository]),
    UserModule,
    StudentModule,
    BookModule,
  ],
  controllers: [BookRequestController],
  providers: [BookRequestService],
  exports: [BookRequestService],
})
export class BookRequestModule {}
