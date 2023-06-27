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
import { CreateLocationDto } from "../../../modules/locations/dto";
import { UsersRole } from "@prisma/client";

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

  @IsEnum(UsersRole)
  @NotEquals(UsersRole.ADMIN)
  @IsNotEmpty()
  role: UsersRole = UsersRole.REGULAR;

  @IsNumberString()
  @Length(11, 11, {
    message:
      "Mobile number must have length $constraint2, but actual is $value",
  })
  @IsOptional()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  @Length(200)
  description?: string;

  @IsNotEmptyObject()
  location: CreateLocationDto;
}
