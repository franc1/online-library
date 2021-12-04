import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';

import { BookCategoryService } from './book-category.service';
import { BookCategory } from './models/book-category.model';
import { BookCategoryDTO } from './models/dto/book-category.dto';

@Controller('book-category')
@ApiTags('book-category')
@ApiBadRequestResponse({
  type: ErrorResponse,
})
@ApiUnauthorizedResponse({
  type: ErrorResponse,
})
@ApiForbiddenResponse({
  type: ErrorResponse,
})
export class BookCategoryController {
  constructor(private readonly bookCategoryService: BookCategoryService) {}

  @Roles([RoleEnum.librarian])
  @Get()
  async getAll(): Promise<BookCategory[]> {
    const bookCategories = await this.bookCategoryService.findAll();

    return plainToClass(BookCategory, bookCategories);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<BookCategory> {
    const bookCategory = await this.bookCategoryService.findOne(id);

    return plainToClass(BookCategory, bookCategory);
  }

  @Roles([RoleEnum.librarian])
  @Post()
  async create(
    @Body() bookCategoryDTO: BookCategoryDTO,
  ): Promise<BookCategory> {
    const bookCategory = await this.bookCategoryService.create(bookCategoryDTO);

    return plainToClass(BookCategory, bookCategory);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() bookCategoryDTO: BookCategoryDTO,
  ): Promise<BookCategory> {
    const bookCategory = await this.bookCategoryService.update(
      id,
      bookCategoryDTO,
    );

    return plainToClass(BookCategory, bookCategory);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.bookCategoryService.delete(id);
  }
}
