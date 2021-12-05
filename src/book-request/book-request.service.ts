import { Injectable, NotFoundException } from '@nestjs/common';
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
import { ResolveRequestDTO } from './models/dto/resolve-request.dto';

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

  async createRequest(
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

  async createReturnRequest(id: number, token: Token): Promise<void> {
    const bookRequest = await this.bookRequestRepository.findOneSafe(id, {
      where: {
        student: token.id,
        requestStatus: BookRequestStatus.accepted,
        returnRequestStatus: null,
      },
    });
    if (!bookRequest) {
      throw new NotFoundException();
    }

    bookRequest.returnRequestDate = new Date();
    bookRequest.returnRequestStatus = BookRequestStatus.requested;
    await this.bookRequestRepository.save(bookRequest);
  }

  async resolveRequest(
    id: number,
    resolveRequestDTO: ResolveRequestDTO,
    token: Token,
  ): Promise<void> {
    const bookRequest = await this.bookRequestRepository.findOneSafe(id, {
      where: {
        requestStatus: BookRequestStatus.requested,
      },
    });
    if (!bookRequest) {
      throw new NotFoundException();
    }

    bookRequest.requestResolvedDate = new Date();
    (bookRequest as any).requestResolvedBy = token.id;
    bookRequest.requestStatus = resolveRequestDTO.bookRequestStatus;
    await this.bookRequestRepository.save(bookRequest);
  }

  async resolveReturnRequest(
    id: number,
    resolveRequestDTO: ResolveRequestDTO,
    token: Token,
  ): Promise<void> {
    const bookRequest = await this.bookRequestRepository.findOneSafe(id, {
      where: {
        requestStatus: BookRequestStatus.accepted,
        returnRequestStatus: BookRequestStatus.requested,
      },
    });
    if (!bookRequest) {
      throw new NotFoundException();
    }

    bookRequest.returnRequestResolvedDate = new Date();
    (bookRequest as any).returnRequestResolvedBy = token.id;
    bookRequest.returnRequestStatus = resolveRequestDTO.bookRequestStatus;
    await this.bookRequestRepository.save(bookRequest);
  }
}
