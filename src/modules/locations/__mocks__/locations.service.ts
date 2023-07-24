import {
  locationTestStub1,
  locationsByStateStub,
  locationsStub
} from "../stubs/locations-service.stub";

export const LocationsServiceMock = jest.fn().mockReturnValue({
  findAll: jest.fn().mockReturnValue(locationsStub()),
  findByState: jest.fn().mockReturnValue(locationsByStateStub()),
  findById: jest.fn().mockReturnValue(locationTestStub1()),
  findByCity: jest.fn().mockReturnValue(locationTestStub1())
});
