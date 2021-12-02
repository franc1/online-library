import { Module } from '@nestjs/common';

import { BookRequestController } from './book-request.controller';
import { BookRequestService } from './book-request.service';

@Module({
  controllers: [BookRequestController],
  providers: [BookRequestService],
})
export class BookRequestModule {}
