import {
  Body,
  Controller,
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
import { TokenParam } from 'src/decorators/token.decorator';
import { RoleEnum } from 'src/role/models/role.model';
import { ErrorResponse } from 'src/shared/error.response';
import { Token } from 'src/shared/token.request';

import { BookRequestService } from './book-request.service';
import { BookRequest } from './models/book-request.model';
import { BookRequestCreateDTO } from './models/dto/book-request-create.dto';
import { ResolveRequestDTO } from './models/dto/resolve-request.dto';

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
  async createRequest(
    @Body() bookRequestDTO: BookRequestCreateDTO,
    @TokenParam() token: Token,
  ): Promise<BookRequest> {
    const bookRequest = await this.bookRequestService.createRequest(
      bookRequestDTO,
      token,
    );

    return plainToClass(BookRequest, bookRequest);
  }

  @Roles([RoleEnum.student], { disallowAdmin: true })
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id/return-request')
  async createReturnRequest(
    @Param('id', ParseIntPipe) id: number,
    @TokenParam() token: Token,
  ): Promise<void> {
    await this.bookRequestService.createReturnRequest(id, token);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id/resolve-request')
  async resolveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() resolveRequestDTO: ResolveRequestDTO,
    @TokenParam() token: Token,
  ): Promise<void> {
    await this.bookRequestService.resolveRequest(id, resolveRequestDTO, token);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id/resolve-return-request')
  async resolveReturnRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() resolveRequestDTO: ResolveRequestDTO,
    @TokenParam() token: Token,
  ): Promise<void> {
    await this.bookRequestService.resolveReturnRequest(
      id,
      resolveRequestDTO,
      token,
    );
  }
}
