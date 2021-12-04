import { IsPositive } from 'class-validator';

export class BookRequestCreateDTO {
  @IsPositive()
  bookId: number;
}
