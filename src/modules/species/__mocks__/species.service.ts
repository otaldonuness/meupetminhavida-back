import { speciesStub } from "../stubs"

export const SpeciesServiceMock = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue(speciesStub()),
  update: jest.fn().mockReturnValue(speciesStub()),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
  getById: jest.fn().mockReturnValue(speciesStub()),
  getAll: jest.fn().mockReturnValue([speciesStub(), speciesStub()])
})
