import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(10)
  @IsString()
  @IsNotEmpty()
  phone: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  address: string;
}
