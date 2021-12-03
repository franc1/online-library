import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BookCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
