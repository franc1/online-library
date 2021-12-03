import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiError } from 'src/shared/api-error';
import { ErrorCodes } from 'src/shared/error-codes';

import { PrintingOfficeCreateDTO } from './models/dto/printing-office-create.dto';
import { PrintingOfficeUpdateDTO } from './models/dto/printing-office-update.dto';
import { PrintingOffice } from './models/printing-office.model';
import { PrintingOfficeRepository } from './printing-office.repository';

@Injectable()
export class PrintingOfficeService {
  constructor(private printingOfficeRepository: PrintingOfficeRepository) {}

  async findAll(): Promise<PrintingOffice[]> {
    return await this.printingOfficeRepository.findSafe();
  }

  async findOne(id: number): Promise<PrintingOffice> {
    const printingOffice = await this.printingOfficeRepository.findOneSafe(id);
    if (!printingOffice) {
      throw new NotFoundException();
    }

    return printingOffice;
  }

  async create(
    printingOfficeDTO: PrintingOfficeCreateDTO,
  ): Promise<PrintingOffice> {
    const printingOffice = new PrintingOffice();
    printingOffice.name = printingOfficeDTO.name;
    printingOffice.address = printingOfficeDTO.address;

    return await this.printingOfficeRepository.save(printingOffice);
  }

  async update(
    id: number,
    printingOfficeDTO: PrintingOfficeUpdateDTO,
  ): Promise<PrintingOffice> {
    const printingOffice = await this.printingOfficeRepository.findOneSafe(id);
    if (!printingOffice) {
      throw new NotFoundException();
    }

    if (printingOfficeDTO.name) {
      printingOffice.name = printingOfficeDTO.name;
    }
    printingOffice.address = printingOfficeDTO.address;

    return await this.printingOfficeRepository.save(printingOffice);
  }

  async delete(id: number): Promise<void> {
    const printingOffice = await this.printingOfficeRepository.findOneSafe(id, {
      relations: ['books'],
    });
    if (!printingOffice) {
      throw new NotFoundException();
    }

    if (printingOffice.books.find((b) => b.deletedDate === null)) {
      throw new ApiError(400, ErrorCodes.CANNOT_DELETE_BOOKS_EXIST);
    }

    await this.printingOfficeRepository.removeSafe(id, printingOffice);
  }
}
