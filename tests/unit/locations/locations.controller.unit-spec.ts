import { Test } from "@nestjs/testing";
import { LocationsServiceMock } from "../../../src/modules/locations/__mocks__/locations.service";
import { LocationsController } from "../../../src/modules/locations/locations.controller";
import { LocationsService } from "../../../src/modules/locations/locations.service";
import {
  FindByCityInputDto,
  FindByStateInputDto
} from "../../../src/modules/locations/dto";

describe("LocationsController Unit tests", () => {
  let locationsController: LocationsController;
  let locationsService: LocationsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        {
          provide: LocationsService,
          useClass: LocationsServiceMock
        }
      ]
    }).compile();

    locationsService = moduleRef.get<LocationsService>(LocationsService);
    locationsController =
      moduleRef.get<LocationsController>(LocationsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll()", () => {
    it("given a location request, when request to find all should return all data", async () => {
      const expectedQuantity = 3;
      const output = await locationsController.findAll();

      expect(locationsService.findAll).toHaveBeenCalled();
      expect(output.locations.length).toBe(expectedQuantity);
    });
  });

  describe("findByState()", () => {
    it("given a location request, when request to find by specific state code should return cities that belong to it", async () => {
      const expectedQuantity = 2;
      const expectedState = new FindByStateInputDto();
      expectedState.state = "CT";

      const output = await locationsController.findByState(expectedState);

      expect(locationsService.findByState).toHaveBeenCalled();
      expect(output.locations.length).toBe(expectedQuantity);
      expect(output.locations[0].id).toBe(
        "93568235-11f8-45af-9a06-e6928e1fb540"
      );
      expect(output.locations[1].id).toBe(
        "a683459f-75c7-4491-aaae-8831373d9f30"
      );
    });
  });

  describe("findById()", () => {
    it("given a location request, when request to find by id should return only on city", async () => {
      const expectedId = "93568235-11f8-45af-9a06-e6928e1fb540";
      const expectedName = "Cidade teste 1";
      const expectedState = "CT";

      const output = await locationsController.findById(expectedId);

      expect(locationsService.findById).toHaveBeenCalled();
      expect(output.id).toBe(expectedId);
      expect(output.city).toBe(expectedName);
      expect(output.state).toBe(expectedState);
    });
  });

  describe("findByCityName()", () => {
    it("given a location request, when request to its name should return ok", async () => {
      const expectedId = "93568235-11f8-45af-9a06-e6928e1fb540";
      const expectedName = "Cidade teste 1";
      const expectedState = "CT";
      const name = new FindByCityInputDto();
      name.city = expectedName;

      const output = await locationsController.findByCityName(name);

      expect(locationsService.findByCity).toHaveBeenCalled();
      expect(output.id).toBe(expectedId);
      expect(output.city).toBe(expectedName);
      expect(output.state).toBe(expectedState);
    });
  });
});
