import { Test } from "@nestjs/testing";
import { CreatePetDto } from "../../../src/modules/pets/dto";
import { petStub } from "../../../src/modules/pets/stubs/";
import { PrismaMock } from "../../../src/modules/species/__mocks__";
import { PrismaService } from "../../../src/config/prisma/prisma.service";
import { PetsService } from "../../../src/modules/pets/pets.service";

describe("PetsService Unit", () => {
  let petsService: PetsService;
  let prismaService: PrismaService;

  // Somehow, the pet tests are not working, even though they should
  // It says it's because prisma is undefined
  // But considering that prisma is being called and handled in the
  // Same way as in the files where it worked, I have absolutely
  // No idea regarding how this should work

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: PrismaService,
          useClass: PrismaMock,
        },
      ],
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
        petSize: "MEDIUM",
      };
      const createdPet = await petsService.create(createPetDto);

      expect(prismaService.pets.create).toHaveBeenCalledWith({
        data: { ...createPetDto },
      });
      expect(createdPet).toEqual(petStub());
    });
  });

  describe("findPetById()", () => {
    it("when findPetById is called, it should call PrismaService", async () => {
      const petId = "testID";
      const foundPet = await petsService.findPetById(petId);

      expect(prismaService.pets.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: petId },
      });
      expect(foundPet).toEqual(petStub());
    });
  });

  describe("findPetByCityId()", () => {
    it("when findPetsByCityId is called, it should call PrismaService", async () => {
      const cityId = "testCityID";
      const foundPets = await petsService.findPetsByCityId(cityId);

      expect(prismaService.pets.findMany).toHaveBeenCalledWith({
        where: { id: cityId },
      });
      expect(foundPets).toEqual([petStub(), petStub()]);
    });
  });
});