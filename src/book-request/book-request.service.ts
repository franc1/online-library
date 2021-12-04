import { Injectable } from '@nestjs/common';
import { BookService } from 'src/book/book.service';
import { ApiError } from 'src/shared/api-error';
import { ErrorCodes } from 'src/shared/error-codes';
import { Token } from 'src/shared/token.request';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';

import { BookRequestRepository } from './book-request.repository';
import { BookRequest, BookRequestStatus } from './models/book-request.model';
import { BookRequestCreateDTO } from './models/dto/book-request-create.dto';

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
    const book = await this.bookService.findOneById(bookRequestDTO.bookId);
    if (!book) {
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
