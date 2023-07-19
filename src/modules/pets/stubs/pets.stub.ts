import { CreatePetDto } from "../dto";

export const petStub = (): CreatePetDto => {
  return {
    name: "test",
    speciesId: "0334f499-a655-4d62-8f0d-2b68a5a1c93e",
    age: 12,
    gender: "m",
    breed: "akita",
    isCastrated: false,
    locationId: "00395870-a458-4fba-8bbf-e91b840524ab",
    description: "test",
    petSize: "MEDIUM",
  };
};
