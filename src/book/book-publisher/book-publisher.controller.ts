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
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';

import { BookPublisherService } from './book-publisher.service';
import { BookPublisher } from './models/book-publisher.model';
import { BookPublisherCreateDTO } from './models/dto/book-publisher-create.dto';
import { BookPublisherUpdateDTO } from './models/dto/book-publisher-update.dto';

@Controller('book-publisher')
@ApiTags('book-publisher')
@ApiBadRequestResponse({
  type: ErrorResponse,
})
@ApiUnauthorizedResponse({
  type: ErrorResponse,
})
@ApiForbiddenResponse({
  type: ErrorResponse,
})
export class BookPublisherController {
  constructor(private readonly bookPublisherService: BookPublisherService) {}

  @Roles([RoleEnum.librarian])
  @Get()
  async getAll(): Promise<BookPublisher[]> {
    const bookPublishers = await this.bookPublisherService.findAll();

    return plainToClass(BookPublisher, bookPublishers);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Get(':id')
  async get(@Param('id') id: number): Promise<BookPublisher> {
    const bookPublisher = await this.bookPublisherService.findOne(id);

    return plainToClass(BookPublisher, bookPublisher);
  }

  @Roles([RoleEnum.librarian])
  @Post()
  async create(
    @Body() bookPublisherDTO: BookPublisherCreateDTO,
  ): Promise<BookPublisher> {
    const bookPublisher = await this.bookPublisherService.create(
      bookPublisherDTO,
    );

    return plainToClass(BookPublisher, bookPublisher);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() bookPublisherDTO: BookPublisherUpdateDTO,
  ): Promise<BookPublisher> {
    const bookPublisher = await this.bookPublisherService.update(
      id,
      bookPublisherDTO,
    );

    return plainToClass(BookPublisher, bookPublisher);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.bookPublisherService.delete(id);
  }
}
