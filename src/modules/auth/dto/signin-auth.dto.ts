import { IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class SignInAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
