import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class SignUpAuthDto {
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

  @IsNumberString()
  @Length(11, 11, {
    message: 'Phone number must have length $constraint2, but actual is $value',
  })
  @IsOptional()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  @IsNotEmpty()
  isOng = false;

  @IsUrl()
  @IsOptional()
  ongWebsite?: string;
}
