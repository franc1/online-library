import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';

import { BookCategoryService } from './book-category.service';
import { BookCategory } from './models/book-category.model';
import { BookCategoryDTO } from './models/dto/request/book-category.dto';

@Controller('book/category')
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
    return await this.bookCategoryService.findAll();
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Get(':id')
  async get(@Param('id') id: number): Promise<BookCategory> {
    return await this.bookCategoryService.findOne(id);
  }

  @Roles([RoleEnum.librarian])
  @Post()
  async create(
    @Body() bookCategoryDTO: BookCategoryDTO,
  ): Promise<BookCategory> {
    return await this.bookCategoryService.create(bookCategoryDTO);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() bookCategoryDTO: BookCategoryDTO,
  ): Promise<BookCategory> {
    return await this.bookCategoryService.update(id, bookCategoryDTO);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.bookCategoryService.delete(id);
  }
}
