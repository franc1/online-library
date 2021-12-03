import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class BookUpdateDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  author?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  isbn?: string;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsPositive()
  bookCategoryId?: number;

  @IsOptional()
  @IsPositive()
  bookPublisherId?: number;

  @IsOptional()
  @IsPositive()
  printingOfficeId?: number;
}
