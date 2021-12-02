import { Book } from 'src/book/models/book.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../shared/repositories/base.repository';

@EntityRepository(Book)
export class BookRepository extends BaseRepository<Book> {}
