import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintingOfficeModule } from 'src/printing-office/printing-office.module';

import { BookCategoryModule } from './book-category/book-category.module';
import { BookPublisherModule } from './book-publisher/book-publisher.module';
import { BookController } from './book.controller';
import { BookRepository } from './book.repository';
import { BookService } from './book.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookRepository]),
    BookCategoryModule,
    BookPublisherModule,
    PrintingOfficeModule,
  ],
  providers: [BookService],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {}
