import { BookCategory } from 'src/models/book_category.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(BookCategory)
export class BookCategoryRepository extends BaseRepository<BookCategory> {}
