import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';

import { BookService } from './book.service';
import { Book } from './models/book.model';
import { BookCreateDTO } from './models/dto/book-create.dto';
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

  @Roles([RoleEnum.librarian])
  @Post()
  async create(@Body() bookDTO: BookCreateDTO): Promise<Book> {
    return await this.bookService.create(bookDTO);
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
    return await this.bookService.update(id, bookDTO);
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
