import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, IsString } from 'class-validator';

import { BookStatus } from '../book.model';

export class BookFilter {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  bookCategoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  bookPublisherId?: number;

  @IsOptional()
  @IsIn(Object.values(BookStatus))
  status?: BookStatus;
}
