import { BookPublisher } from 'src/models/book_publisher.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(BookPublisher)
export class BookPublisherRepository extends BaseRepository<BookPublisher> {}
