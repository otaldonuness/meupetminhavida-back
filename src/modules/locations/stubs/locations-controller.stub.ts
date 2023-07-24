import {
  LocationOutputDto,
  LocationOutputListDto
} from "../dto/location-output.dto";

export const locationsDtoListStub = (): LocationOutputListDto => {
  return {
    locations: [
      locationDtoTestStub1(),
      locationDtoTestStub2(),
      locationDtoTestStub3()
    ]
  };
};

export const locationsByStateDtoListStub = (): LocationOutputListDto => {
  return { locations: [locationDtoTestStub1(), locationDtoTestStub2()] };
};

export const locationDtoTestStub1 = (): LocationOutputDto => {
  return {
    id: "93568235-11f8-45af-9a06-e6928e1fb540",
    city: "Cidade teste 1",
    state: "CT"
  };
};

export const locationDtoTestStub2 = (): LocationOutputDto => {
  return {
    id: "a683459f-75c7-4491-aaae-8831373d9f30",
    city: "Cidade teste 2",
    state: "CT"
  };
};

export const locationDtoTestStub3 = (): LocationOutputDto => {
  return {
    id: "a683459f-75c7-4491-aaae-8831373d9f30",
    city: "Cidade teste de outro estado",
    state: "OT"
  };
};
