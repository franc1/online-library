import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { BookRequestStatus } from '../book-request.model';

export class ResolveRequestDTO {
  @IsIn([BookRequestStatus.accepted, BookRequestStatus.rejected])
  @ApiProperty({
    enum: [BookRequestStatus.accepted, BookRequestStatus.rejected],
  })
  bookRequestStatus: BookRequestStatus;
}
