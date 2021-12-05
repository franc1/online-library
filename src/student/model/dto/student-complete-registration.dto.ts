import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class StudentCompleteRegistrationDTO {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  registrationCode: string;
}
