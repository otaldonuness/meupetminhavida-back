import { Test } from "@nestjs/testing";
import { CreatePetDto } from "../dto";
import { PrismaMock } from "../__mocks__/prisma-service.mock";
import { PrismaService } from "../../../config/prisma/prisma.service";
import { PetsService } from "../pets.service";
import { petStub } from "../stubs";

describe("PetsService Unit", () => {
  let petsService: PetsService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: PrismaService,
          useClass: PrismaMock
        }
      ]
    }).compile();

    petsService = moduleRef.get<PetsService>(PetsService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create()", () => {
    it("when create is called, it should call PrismaService", async () => {
      const createPetDto: CreatePetDto = {
        name: "test",
        speciesId: "testSpeciesID",
        age: 12,
        gender: "m",
        breed: "testBreed",
        isCastrated: false,
        locationId: "testCityID",
        description: "test",
        petSize: "MEDIUM"
      };
      const createdPet = await petsService.create(createPetDto);

      expect(prismaService.pets.create).toHaveBeenCalled();
      expect(createdPet).toEqual(petStub());
    });
  });

  describe("findPetById()", () => {
    it("when findPetById is called, it should call PrismaService", async () => {
      const petId = "testID";
      const foundPet = await petsService.findPetById(petId);

      expect(prismaService.pets.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: petId }
      });
      expect(foundPet).toEqual(petStub());
    });
  });

  describe("findPetByCityId()", () => {
    it("when findPetsByCityId is called, it should call PrismaService", async () => {
      const cityId = "testCityID";
      const foundPets = await petsService.findPetsByCityId(cityId);

      expect(prismaService.pets.findMany).toHaveBeenCalledWith({
        where: { locationId: cityId }
      });
      expect(foundPets).toEqual([petStub()]);
    });
  });
});
