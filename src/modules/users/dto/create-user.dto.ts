import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  role: string

  @IsNumber()
  @IsNotEmpty()
  locationId: number

  @IsNumberString()
  @Length(11, 11, {
    message: 'Phone number must have length $constraint2, but actual is $value',
  })
  @IsOptional()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(255)
  hashRT?: string
}
