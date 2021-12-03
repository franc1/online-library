import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class BookPublisherUpdateDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  address?: string;
}
