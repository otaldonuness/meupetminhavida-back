import { petStub } from "../stubs/pets.stub";

export const PetsServiceMock = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(petStub()),
  getPetById: jest.fn().mockResolvedValue(petStub()),
  getAll: jest.fn().mockResolvedValue(petStub()),
});
