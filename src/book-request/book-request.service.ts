import { Injectable } from '@nestjs/common';
import * as config from 'config';
import { BookService } from 'src/book/book.service';
import { BookStatus } from 'src/book/models/book.model';
import { ApiError } from 'src/shared/api-error';
import { ErrorCodes } from 'src/shared/error-codes';
import { Token } from 'src/shared/token.request';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';
import { Not } from 'typeorm';

import { BookRequestRepository } from './book-request.repository';
import { BookRequest, BookRequestStatus } from './models/book-request.model';
import { BookRequestCreateDTO } from './models/dto/book-request-create.dto';

const maxNumberOfIssuedBooksPerStudent = config.get(
  'maxNumberOfIssuedBooksPerStudent',
);

@Injectable()
export class BookRequestService {
  constructor(
    private readonly bookRequestRepository: BookRequestRepository,
    private readonly userService: UserService,
    private readonly bookService: BookService,
    private readonly studentService: StudentService,
  ) {}

  async create(
    bookRequestDTO: BookRequestCreateDTO,
    token: Token,
  ): Promise<BookRequest> {
    // Check number of current issued books
    const countUnreturnedBooks = await this.bookRequestRepository.countSafe({
      where: [
        {
          student: token.id,
          requestStatus: BookRequestStatus.accepted,
          returnRequestStatus: null,
        },
        {
          student: token.id,
          requestStatus: BookRequestStatus.accepted,
          returnRequestStatus: Not(`${BookRequestStatus.accepted}`),
        },
      ],
    });
    if (countUnreturnedBooks >= maxNumberOfIssuedBooksPerStudent) {
      throw new ApiError(400, ErrorCodes.MAXIMUM_ISSUED_BOOKS);
    }

    const book = await this.bookService.findOneById(bookRequestDTO.bookId);
    if (!book || book.status === BookStatus.issued) {
      throw new ApiError(400, ErrorCodes.INVALID_BOOK);
    }

    const student = await this.studentService.findOne(
      { id: token.id },
      { withRole: true },
    );
    if (!student) {
      throw new ApiError(400, ErrorCodes.INVALID_STUDENT);
    }

    const bookRequest = new BookRequest();
    bookRequest.book = book;
    bookRequest.student = student;
    bookRequest.requestDate = new Date();
    bookRequest.requestStatus = BookRequestStatus.requested;
    return await this.bookRequestRepository.save(bookRequest);
  }
}
