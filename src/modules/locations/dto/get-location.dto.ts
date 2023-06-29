import { IsNotEmpty, IsNumber } from "class-validator";

export class GetLocationInputDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class GetLocationOutputDto {
  id: number;
  city: string;
  state: string;
}
