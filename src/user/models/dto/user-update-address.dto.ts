import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UserUpdateAddressDTO {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  address: string;
}
