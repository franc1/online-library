import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiError } from 'src/shared/api-error';
import { ErrorCodes } from 'src/shared/error-codes';

import { BookPublisherRepository } from './book-publisher.repository';
import { BookPublisher } from './models/book-publisher.model';
import { BookPublisherCreateDTO } from './models/dto/book-publisher-create.dto';
import { BookPublisherUpdateDTO } from './models/dto/book-publisher-update.dto';

@Injectable()
export class BookPublisherService {
  constructor(private bookPublisherRepository: BookPublisherRepository) {}

  async findAll(): Promise<BookPublisher[]> {
    return await this.bookPublisherRepository.findSafe();
  }

  async findOne(id: number): Promise<BookPublisher> {
    const bookPublisher = await this.bookPublisherRepository.findOneSafe(id);
    if (!bookPublisher) {
      throw new NotFoundException();
    }

    return bookPublisher;
  }

  async create(
    bookPublisherDTO: BookPublisherCreateDTO,
  ): Promise<BookPublisher> {
    const bookPublisher = new BookPublisher();
    bookPublisher.name = bookPublisherDTO.name;
    bookPublisher.address = bookPublisherDTO.address;

    return await this.bookPublisherRepository.save(bookPublisher);
  }

  async update(
    id: number,
    bookPublisherDTO: BookPublisherUpdateDTO,
  ): Promise<BookPublisher> {
    const bookPublisher = await this.bookPublisherRepository.findOneSafe(id);
    if (!bookPublisher) {
      throw new NotFoundException();
    }

    if (bookPublisherDTO.name) {
      bookPublisher.name = bookPublisherDTO.name;
    }
    bookPublisher.address = bookPublisherDTO.address;

    return await this.bookPublisherRepository.save(bookPublisher);
  }

  async delete(id: number): Promise<void> {
    const bookPublisher = await this.bookPublisherRepository.findOneSafe(id, {
      relations: ['books'],
    });
    if (!bookPublisher) {
      throw new NotFoundException();
    }

    if (bookPublisher.books.find((b) => b.deletedDate === null)) {
      throw new ApiError(400, ErrorCodes.CANNOT_DELETE_BOOKS_EXIST);
    }

    await this.bookPublisherRepository.removeSafe(id, bookPublisher);
  }
}
