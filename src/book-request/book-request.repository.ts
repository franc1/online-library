import { BookRequest } from 'src/book-request/models/book-request.model';
import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../shared/repositories/base.repository';

@EntityRepository(BookRequest)
export class BookRequestRepository extends BaseRepository<BookRequest> {}
