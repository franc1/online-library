import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { TokenParam } from 'src/decorators/token.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';
import { Token } from 'src/shared/token.request';

import { BookService } from './book.service';
import { Book } from './models/book.model';
import { BookCreateDTO } from './models/dto/book-create.dto';
import { BookFilter } from './models/dto/book-filter.dto';
import { BookUpdateDTO } from './models/dto/book-update.dto';

@Controller('book')
@ApiTags('book')
@ApiBadRequestResponse({
  type: ErrorResponse,
})
@ApiUnauthorizedResponse({
  type: ErrorResponse,
})
@ApiForbiddenResponse({
  type: ErrorResponse,
})
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Roles([RoleEnum.librarian, RoleEnum.student])
  @Get()
  async getAll(@Query() bookFilter: BookFilter): Promise<Book[]> {
    const books = await this.bookService.getAll(bookFilter);

    return plainToClass(Book, books);
  }

  @Roles([RoleEnum.librarian, RoleEnum.student])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Get(':id')
  async get(
    @Param('id') id: number,
    @TokenParam() token: Token,
  ): Promise<Book> {
    const book = await this.bookService.get(id, token);

    return plainToClass(Book, book);
  }

  @Roles([RoleEnum.librarian])
  @Post()
  async create(@Body() bookDTO: BookCreateDTO): Promise<Book> {
    const book = await this.bookService.create(bookDTO);

    return plainToClass(Book, book);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() bookDTO: BookUpdateDTO,
  ): Promise<Book> {
    const book = await this.bookService.update(id, bookDTO);

    return plainToClass(Book, book);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.bookService.delete(id);
  }
}
