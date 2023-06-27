import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateLocationDto {
  @IsString()
  @Length(50)
  @IsNotEmpty()
  city: string;

  @IsString()
  @Length(2)
  @IsNotEmpty()
  state: string;

  @IsString()
  @Length(8)
  @IsNotEmpty()
  @Matches(/^[0-9]{8}$/, {
    message: "Zip code must be in the format XXXXXXXX",
  })
  zip: string;
}
