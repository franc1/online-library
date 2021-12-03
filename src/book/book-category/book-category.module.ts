import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookCategoryController } from './book-category.controller';
import { BookCategoryRepository } from './book-category.repository';
import { BookCategoryService } from './book-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookCategoryRepository])],
  providers: [BookCategoryService],
  controllers: [BookCategoryController],
  exports: [BookCategoryService],
})
export class BookCategoryModule {}
