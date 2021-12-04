import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  newPassword: string;
}
