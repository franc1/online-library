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

import { PrintingOfficeCreateDTO } from './models/dto/printing-office-create.dto';
import { PrintingOfficeUpdateDTO } from './models/dto/printing-office-update.dto';
import { PrintingOffice } from './models/printing-office.model';
import { PrintingOfficeService } from './printing-office.service';

@Controller('printing-office')
@ApiTags('printing-office')
@ApiBadRequestResponse({
  type: ErrorResponse,
})
@ApiUnauthorizedResponse({
  type: ErrorResponse,
})
@ApiForbiddenResponse({
  type: ErrorResponse,
})
export class PrintingOfficeController {
  constructor(private readonly printingOfficeService: PrintingOfficeService) {}

  @Roles([RoleEnum.librarian])
  @Get()
  async getAll(): Promise<PrintingOffice[]> {
    const printingOffices = await this.printingOfficeService.findAll();

    return plainToClass(PrintingOffice, printingOffices);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<PrintingOffice> {
    const printingOffice = await this.printingOfficeService.findOne(id);

    return plainToClass(PrintingOffice, printingOffice);
  }

  @Roles([RoleEnum.librarian])
  @Post()
  async create(
    @Body() printingOfficeDTO: PrintingOfficeCreateDTO,
  ): Promise<PrintingOffice> {
    const printingOffice = await this.printingOfficeService.create(
      printingOfficeDTO,
    );

    return plainToClass(PrintingOffice, printingOffice);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() printingOfficeDTO: PrintingOfficeUpdateDTO,
  ): Promise<PrintingOffice> {
    const printingOffice = await this.printingOfficeService.update(
      id,
      printingOfficeDTO,
    );

    return plainToClass(PrintingOffice, printingOffice);
  }

  @Roles([RoleEnum.librarian])
  @ApiNotFoundResponse({
    type: ErrorResponse,
  })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.printingOfficeService.delete(id);
  }
}
