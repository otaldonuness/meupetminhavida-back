import { Locations } from "@prisma/client";

export const locationsStub = (): Locations[] => {
  return [
    locationTestStub1(),
    locationTestStub2(),
    locationOtherStateTestStub()
  ];
};

export const locationsByStateStub = (): Locations[] => {
  return [locationTestStub1(), locationTestStub2()];
};

export const locationTestStub1 = (): Locations => {
  return {
    id: "93568235-11f8-45af-9a06-e6928e1fb540",
    city: "Cidade teste 1",
    state: "CT",
    createdAt: new Date("2023-07 22"),
    updatedAt: new Date("2023-07 22")
  };
};

export const locationTestStub2 = (): Locations => {
  return {
    id: "a683459f-75c7-4491-aaae-8831373d9f30",
    city: "Cidade teste 2",
    state: "CT",
    createdAt: new Date("2023-07 22"),
    updatedAt: new Date("2023-07 22")
  };
};

export const locationOtherStateTestStub = (): Locations => {
  return {
    id: "184565c8-74c7-4874-9964-1b0e09c8c67e",
    city: "Cidade teste outro estado",
    state: "OT",
    createdAt: new Date("2023-07 22"),
    updatedAt: new Date("2023-07 22")
  };
};
