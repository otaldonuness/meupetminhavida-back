import { IsNotEmpty, IsString } from "class-validator";

export class GetLocationByStateInputDto {
  @IsNotEmpty()
  @IsString()
  state: string;
}

type city = {
  id: string;
  city: string;
};

export class GetLocationByStateOutputDto {
  cities: city[];
}
