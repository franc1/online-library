import { Module } from '@nestjs/common';

import { BookPublisherController } from './book-publisher.controller';
import { BookPublisherService } from './book-publisher.service';

@Module({
  providers: [BookPublisherService],
  controllers: [BookPublisherController],
})
export class BookPublisherModule {}
