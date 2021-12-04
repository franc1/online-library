import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/decorators/roles.decorator';
import { TokenParam } from 'src/decorators/token.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';
import { Token } from 'src/shared/token.request';

import { BookRequestService } from './book-request.service';
import { BookRequest } from './models/book-request.model';
import { BookRequestCreateDTO } from './models/dto/book-request-create.dto';

@Controller('book-request')
@ApiTags('book-request')
@ApiBadRequestResponse({
  type: ErrorResponse,
})
@ApiUnauthorizedResponse({
  type: ErrorResponse,
})
@ApiForbiddenResponse({
  type: ErrorResponse,
})
export class BookRequestController {
  constructor(private readonly bookRequestService: BookRequestService) {}

  @Roles([RoleEnum.student], { disallowAdmin: true })
  @Post()
  async create(
    @Body() bookRequestDTO: BookRequestCreateDTO,
    @TokenParam() token: Token,
  ): Promise<BookRequest> {
    const bookRequest = await this.bookRequestService.create(
      bookRequestDTO,
      token,
    );

    return plainToClass(BookRequest, bookRequest);
  }
}
