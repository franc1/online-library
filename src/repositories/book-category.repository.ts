import { BookCategory } from 'src/book/book-category/models/book-category.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(BookCategory)
export class BookCategoryRepository extends BaseRepository<BookCategory> {}
