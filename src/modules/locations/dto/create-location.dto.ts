import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateLocationDto {
  @IsString()
  @Length(50)
  @IsNotEmpty()
  city: string;

  @IsString()
  @Length(2)
  @IsNotEmpty()
  state: string;
}
