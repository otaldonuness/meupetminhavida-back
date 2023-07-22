import { Test } from "@nestjs/testing";
import { PrismaService } from "../../../src/config/prisma/prisma.service";
import {
  PrismaMock,
  PrismaMockFindManyOverload
} from "../../../src/modules/locations/_mocks__";
import { LocationsService } from "../../../src/modules/locations/locations.service";

describe("Location service unit tests", () => {
  let locationsService: LocationsService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: PrismaService,
          useClass: PrismaMock
        }
      ]
    }).compile();

    locationsService = moduleRef.get<LocationsService>(LocationsService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findAll()", () => {
    it("given a valid call when findAll is retrivied should return all cities", async () => {
      const expectedQuantity = 3;
      const output = await locationsService.findAll();

      expect(prismaService.locations.findMany).toHaveBeenCalled();
      expect(output.length).toBe(expectedQuantity);
    });
  });

  describe("findById()", () => {
    it("given a valid city id, when tries to find it should return ok", async () => {
      const expectedCityId = "93568235-11f8-45af-9a06-e6928e1fb540";
      const expectedName = "Cidade teste 1";
      const expectedState = "CT";
      const output = await locationsService.findById(expectedCityId);

      expect(prismaService.locations.findUniqueOrThrow).toHaveBeenCalled();
      expect(output.id).toBe(expectedCityId);
      expect(output.city).toBe(expectedName);
      expect(output.state).toBe(expectedState);
    });
  });

  describe("findByCity()", () => {
    it("given a valid city id, when tries to find it should return ok", async () => {
      const expectedCityId = "93568235-11f8-45af-9a06-e6928e1fb540";
      const expectedName = "Cidade teste 1";
      const expectedState = "CT";
      const output = await locationsService.findByCity(expectedName);

      expect(prismaService.locations.findFirst).toHaveBeenCalled();
      expect(output.id).toBe(expectedCityId);
      expect(output.city).toBe(expectedName);
      expect(output.state).toBe(expectedState);
    });
  });
});

describe("Location findByState unit tests", () => {
  let locationsService: LocationsService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: PrismaService,
          useClass: PrismaMockFindManyOverload
        }
      ]
    }).compile();

    locationsService = moduleRef.get<LocationsService>(LocationsService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByState()", () => {
    it("given a valid state, when tries to find it using its state name should return cities that belongs to it", async () => {
      const expectedQuantity = 2;
      const expectedState = "CT";
      const output = await locationsService.findByState(expectedState);

      expect(prismaService.locations.findMany).toHaveBeenCalled();
      expect(output.length).toBe(expectedQuantity);
      expect(output[0].state).toBe(expectedState);
      expect(output[1].state).toBe(expectedState);
    });
  });
});
