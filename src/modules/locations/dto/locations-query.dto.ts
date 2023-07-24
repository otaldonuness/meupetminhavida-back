import { IsString, Length } from "class-validator";

export class FindByCityInputDto {
  @IsString()
  city: string;
}

export class FindByStateInputDto {
  @IsString()
  @Length(2)
  state: string;
}
