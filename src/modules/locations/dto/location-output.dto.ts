export class LocationOutputDto {
  id: string;
  city: string;
  state: string;
}

export class LocationOutputListDto {
  locations: LocationOutputDto[];
}
