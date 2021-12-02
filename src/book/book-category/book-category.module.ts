import { Module } from '@nestjs/common';

import { BookCategoryController } from './book-category.controller';
import { BookCategoryService } from './book-category.service';

@Module({
  providers: [BookCategoryService],
  controllers: [BookCategoryController],
})
export class BookCategoryModule {}
