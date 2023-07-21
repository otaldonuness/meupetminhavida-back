import { CreatePetDto } from "../dto";

export const petStub = (): CreatePetDto => {
  return {
    name: "test",
    speciesId: "testSpeciesID",
    age: 12,
    gender: "m",
    breed: "testBreed",
    isCastrated: false,
    locationId: "testCityID",
    description: "test",
    petSize: "MEDIUM",
  };
};
