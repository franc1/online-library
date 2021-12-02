import { BookPublisher } from 'src/book/book-publisher/models/book-publisher.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../../shared/repositories/base.repository';

@EntityRepository(BookPublisher)
export class BookPublisherRepository extends BaseRepository<BookPublisher> {}
