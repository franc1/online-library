import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { PrintingOfficeService } from 'src/printing-office/printing-office.service';
import { ApiError } from 'src/shared/api-error';
import { ErrorCodes } from 'src/shared/error-codes';
import { downloadFile } from 'src/shared/file-upload-download.utils';
import { Token } from 'src/shared/token.request';
import { FindCondition, Like } from 'typeorm';
import { promisify } from 'util';

import { BookCategoryService } from './book-category/book-category.service';
import { BookPublisherService } from './book-publisher/book-publisher.service';
import { BookRepository } from './book.repository';
import { Book, BookStatus } from './models/book.model';
import { BookCreateDTO } from './models/dto/book-create.dto';
import { BookFilter } from './models/dto/book-filter.dto';
import { BookUpdateDTO } from './models/dto/book-update.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly bookCategoryService: BookCategoryService,
    private readonly bookPublisherService: BookPublisherService,
    private readonly printingOfficeService: PrintingOfficeService,
  ) {}

  async getAll(bookFilter: BookFilter): Promise<Book[]> {
    const { query, bookCategoryId, bookPublisherId, status } = bookFilter;

    const where: FindCondition<Book> = {};
    if (query) {
      where.title = Like(`%${query}%`);
    }
    if (bookCategoryId) {
      (where as any).bookCategory = bookCategoryId;
    }
    if (bookPublisherId) {
      (where as any).bookPublisher = bookPublisherId;
    }
    if (status) {
      where.status = status;
    }

    const books = await this.bookRepository.findSafe({
      relations: ['bookCategory', 'bookPublisher', 'printingOffice'],
      where,
    });

    return books;
  }

  async get(id: number, token: Token): Promise<Book> {
    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect(
        'book.bookCategory',
        'bookCategory',
        'bookCategory.deleted_at IS NULL',
      )
      .leftJoinAndSelect(
        'book.bookPublisher',
        'bookPublisher',
        'bookPublisher.deleted_at IS NULL',
      )
      .leftJoinAndSelect(
        'book.printingOffice',
        'printingOffice',
        'printingOffice.deleted_at IS NULL',
      );
    if (!token.isStudent) {
      query
        .leftJoinAndSelect(
          'book.bookRequests',
          'bookRequest',
          'bookRequest.deleted_at IS NULL',
        )
        .leftJoinAndSelect('bookRequest.student', 'student')
        .leftJoinAndSelect('bookRequest.requestResolvedBy', 'requestResolvedBy')
        .leftJoinAndSelect(
          'bookRequest.returnRequestResolvedBy',
          'returnRequestResolvedBy',
        );
    }

    const book = await query
      .where('book.deleted_at IS NULL')
      .andWhere('book.id = :id', { id })
      .getOne();
    if (!book) {
      throw new NotFoundException();
    }

    return book;
  }

  async downloadBookImage(id: number, response: Response): Promise<any> {
    const book = await this.bookRepository.findOneSafe(id);
    if (!book?.picture) {
      throw new NotFoundException();
    }

    return await downloadFile(book.picture, response);
  }

  async create(bookDTO: BookCreateDTO): Promise<Book> {
    const book = new Book();

    // Check sent ids
    if (bookDTO.bookCategoryId) {
      try {
        book.bookCategory = await this.bookCategoryService.findOne(
          bookDTO.bookCategoryId,
        );
      } catch (e) {
        throw new ApiError(400, ErrorCodes.INVALID_BOOK_CATEGORY);
      }
    }
    if (bookDTO.bookPublisherId) {
      try {
        book.bookPublisher = await this.bookPublisherService.findOne(
          bookDTO.bookPublisherId,
        );
      } catch (e) {
        throw new ApiError(400, ErrorCodes.INVALID_BOOK_PUBLISHER);
      }
    }
    if (bookDTO.printingOfficeId) {
      try {
        book.printingOffice = await this.printingOfficeService.findOne(
          bookDTO.printingOfficeId,
        );
      } catch (e) {
        throw new ApiError(400, ErrorCodes.INVALID_PRINTING_OFFICE);
      }
    }

    book.title = bookDTO.title;
    book.author = bookDTO.author;
    book.isbn = bookDTO.isbn;
    book.status = BookStatus.free;
    if (bookDTO.publicationDate) {
      book.publicationDate = new Date(bookDTO.publicationDate);
    }
    // TODO - implement book picture later !

    return await this.bookRepository.save(book);
  }

  async update(id: number, bookDTO: BookUpdateDTO): Promise<Book> {
    const book = await this.bookRepository.findOneSafe(id, {
      relations: ['bookCategory', 'bookPublisher', 'printingOffice'],
    });
    if (!book) {
      throw new NotFoundException();
    }

    // Check sent ids
    if (bookDTO.bookCategoryId) {
      try {
        book.bookCategory = await this.bookCategoryService.findOne(
          bookDTO.bookCategoryId,
        );
      } catch (e) {
        throw new ApiError(400, ErrorCodes.INVALID_BOOK_CATEGORY);
      }
    } else if (bookDTO.bookCategoryId === null) {
      book.bookCategory = null;
    }
    if (bookDTO.bookPublisherId) {
      try {
        book.bookPublisher = await this.bookPublisherService.findOne(
          bookDTO.bookPublisherId,
        );
      } catch (e) {
        throw new ApiError(400, ErrorCodes.INVALID_BOOK_PUBLISHER);
      }
    } else if (bookDTO.bookPublisherId === null) {
      book.bookPublisher = null;
    }
    if (bookDTO.printingOfficeId) {
      try {
        book.printingOffice = await this.printingOfficeService.findOne(
          bookDTO.printingOfficeId,
        );
      } catch (e) {
        throw new ApiError(400, ErrorCodes.INVALID_PRINTING_OFFICE);
      }
    } else if (bookDTO.printingOfficeId === null) {
      book.printingOffice = null;
    }

    if (bookDTO.title) {
      book.title = bookDTO.title;
    }
    if (bookDTO.author) {
      book.author = bookDTO.author;
    }
    if (bookDTO.isbn) {
      book.isbn = bookDTO.isbn;
    }
    if (bookDTO.publicationDate) {
      book.publicationDate = new Date(bookDTO.publicationDate);
    } else if (bookDTO.publicationDate === null) {
      book.publicationDate = null;
    }
    // TODO - implement book picture later !

    return await this.bookRepository.save(book);
  }

  async uploadBookImage(id: number, imagePath: string): Promise<Book> {
    const book = await this.bookRepository.findOneSafe(id, {
      relations: ['bookCategory', 'bookPublisher', 'printingOffice'],
    });
    if (!book) {
      throw new NotFoundException();
    }

    if (imagePath) {
      if (book.picture) {
        try {
          await promisify(fs.unlink)(book.picture);
        } catch {}
      }
      book.picture = imagePath;
    }

    return await this.bookRepository.save(book);
  }

  async delete(id: number): Promise<void> {
    const book = await this.bookRepository.findOneSafe(id);
    if (!book) {
      throw new NotFoundException();
    }
    if (book.status === BookStatus.issued) {
      throw new ApiError(400, ErrorCodes.CANNOT_DELETE_BOOK_ISSUED);
    }

    await this.bookRepository.removeSafe(id, book);
  }

  async findOneById(id: number): Promise<Book> {
    return await this.bookRepository.findOneSafe(id);
  }
}
