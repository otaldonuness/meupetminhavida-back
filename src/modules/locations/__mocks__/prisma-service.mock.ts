import {
  locationsStub,
  locationTestStub1
} from "../stubs/locations-service.stub";

export const PrismaMock = jest.fn().mockReturnValue({
  locations: {
    findUniqueOrThrow: jest.fn().mockResolvedValue(locationTestStub1()),
    findFirst: jest.fn().mockResolvedValue(locationTestStub1()),
    findMany: jest.fn().mockResolvedValue(locationsStub())
  }
});
