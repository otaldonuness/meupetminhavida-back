import { PetSize, Pets } from "@prisma/client";
import { CreatePetDto } from "../dto";

export const petStub = (): Pets => {
  return {
    id: "test-uuid",
    locationId: "testCityID",
    speciesId: "testSpeciesID",
    name: "test",
    gender: "m",
    breed: "testBreed",
    isCastrated: false,
    age: 12,
    size: PetSize.MEDIUM,
    description: "test",
    createdAt: new Date("2023-06-30 20:58:04"),
    updatedAt: new Date("2023-06-30 20:58:04")
  };
};
