import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookPublisherController } from './book-publisher.controller';
import { BookPublisherRepository } from './book-publisher.repository';
import { BookPublisherService } from './book-publisher.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookPublisherRepository])],
  providers: [BookPublisherService],
  controllers: [BookPublisherController],
  exports: [BookPublisherService],
})
export class BookPublisherModule {}
