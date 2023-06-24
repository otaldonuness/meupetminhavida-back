import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  NotEquals,
} from "class-validator";
import { UserRole } from "../enums";
import { CreateLocationDto } from "../../../modules/locations/dto";

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

  @IsEnum(UserRole)
  @NotEquals(UserRole.ADMIN)
  @IsNotEmpty()
  role: string = UserRole.REGULAR;

  @IsNumberString()
  @Length(11, 11, {
    message: "Phone number must have length $constraint2, but actual is $value",
  })
  @IsOptional()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  @Length(200)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(255)
  hashRT?: string;

  @IsNotEmptyObject()
  location: CreateLocationDto;
}
