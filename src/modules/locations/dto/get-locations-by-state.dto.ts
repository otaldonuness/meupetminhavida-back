import { IsNotEmpty, IsString } from "class-validator";

export class GetLocationByStateInputDto {
  @IsNotEmpty()
  @IsString()
  state: string;
}

type city = {
  id: number;
  city: string;
  state: string;
};

export class GetLocationByStateOutputDto {
  cities: city[];
}
