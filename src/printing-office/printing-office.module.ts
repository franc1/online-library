import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PrintingOfficeController } from './printing-office.controller';
import { PrintingOfficeRepository } from './printing-office.repository';
import { PrintingOfficeService } from './printing-office.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrintingOfficeRepository])],
  providers: [PrintingOfficeService],
  controllers: [PrintingOfficeController],
  exports: [PrintingOfficeService],
})
export class PrintingOfficeModule {}
