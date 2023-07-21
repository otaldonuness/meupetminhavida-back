import { speciesStub } from "../stubs";

export const PrismaMock = jest.fn().mockReturnValue({
  species: {
    create: jest.fn().mockResolvedValue(speciesStub()),
    update: jest.fn().mockResolvedValue(speciesStub()),
    delete: jest.fn().mockResolvedValue(Promise.resolve()),
    findMany: jest.fn().mockResolvedValue([speciesStub(), speciesStub()]),
    findUniqueOrThrow: jest.fn().mockResolvedValue(speciesStub()),
  },
});
