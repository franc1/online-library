import { Module } from '@nestjs/common';

import { PrintingOfficeController } from './printing-office.controller';
import { PrintingOfficeService } from './printing-office.service';

@Module({
  providers: [PrintingOfficeService],
  controllers: [PrintingOfficeController],
})
export class PrintingOfficeModule {}
