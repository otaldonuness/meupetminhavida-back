import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).*$/, {
    message:
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 numeric digit, 1 special character, and be at least 8 characters long.",
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsNumberString()
  @Length(11, 11, {
    message: "Phone number must have length $constraint2, but actual is $value",
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
  hashRT?: string;
}
