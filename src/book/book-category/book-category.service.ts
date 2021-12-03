import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiError } from 'src/shared/api-error';
import { ErrorCodes } from 'src/shared/error-codes';
import { Not } from 'typeorm';

import { BookCategoryRepository } from './book-category.repository';
import { BookCategory } from './models/book-category.model';
import { BookCategoryDTO } from './models/dto/book-category.dto';

@Injectable()
export class BookCategoryService {
  constructor(private bookCategoryRepository: BookCategoryRepository) {}

  async findAll(): Promise<BookCategory[]> {
    return await this.bookCategoryRepository.findSafe();
  }

  async findOne(id: number): Promise<BookCategory> {
    const bookCategory = await this.bookCategoryRepository.findOneSafe(id);
    if (!bookCategory) {
      throw new NotFoundException();
    }

    return bookCategory;
  }

  async create(bookCategoryDTO: BookCategoryDTO): Promise<BookCategory> {
    const bookCategoryNameExists = await this.bookCategoryRepository.countSafe({
      where: { name: bookCategoryDTO.name },
    });
    if (bookCategoryNameExists > 0) {
      throw new ApiError(400, ErrorCodes.BOOK_CATEGORY_NAME_ALREADY_EXISTS);
    }

    const bookCategory = new BookCategory();
    bookCategory.name = bookCategoryDTO.name;

    return await this.bookCategoryRepository.save(bookCategory);
  }

  async update(
    id: number,
    bookCategoryDTO: BookCategoryDTO,
  ): Promise<BookCategory> {
    const bookCategory = await this.bookCategoryRepository.findOneSafe(id);
    if (!bookCategory) {
      throw new NotFoundException();
    }

    const bookCategoryNameExists = await this.bookCategoryRepository.countSafe({
      where: { name: bookCategoryDTO.name, id: Not(id) },
    });
    if (bookCategoryNameExists > 0) {
      throw new ApiError(400, ErrorCodes.BOOK_CATEGORY_NAME_ALREADY_EXISTS);
    }

    bookCategory.name = bookCategoryDTO.name;

    return await this.bookCategoryRepository.save(bookCategory);
  }

  async delete(id: number): Promise<void> {
    const bookCategory = await this.bookCategoryRepository.findOneSafe(id, {
      relations: ['books'],
    });
    if (!bookCategory) {
      throw new NotFoundException();
    }

    if (bookCategory.books.find((b) => b.deletedDate === null)) {
      throw new ApiError(400, ErrorCodes.CANNOT_DELETE_BOOKS_EXIST);
    }

    await this.bookCategoryRepository.removeSafe(id, bookCategory);
  }
}
