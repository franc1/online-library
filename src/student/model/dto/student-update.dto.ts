import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class StudentUpdateDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(13)
  @MaxLength(13)
  personalId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password: string; // Librarian can reset student's password
}
