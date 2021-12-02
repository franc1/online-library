import { BookPublisher } from 'src/book/book-publisher/models/book-publisher.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(BookPublisher)
export class BookPublisherRepository extends BaseRepository<BookPublisher> {}
