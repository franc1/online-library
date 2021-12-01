import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  isStudent?: boolean;
}
