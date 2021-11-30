import { BookRequest } from 'src/models/book_request.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from './base.repository';

@EntityRepository(BookRequest)
export class BookRequestRepository extends BaseRepository<BookRequest> {}
