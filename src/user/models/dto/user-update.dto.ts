import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserUpdateDTO {
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
  password: string;

  @IsOptional()
  @IsPositive()
  roleId: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  address: string;
}
