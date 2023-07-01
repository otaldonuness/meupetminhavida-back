import { IsNotEmpty, IsNumber } from "class-validator";

export class GetLocationInputDto {
  @IsNumber()
  @IsNotEmpty()
  id: string;
}

export class GetLocationOutputDto {
  id: string;
  city: string;
  state: string;
}
