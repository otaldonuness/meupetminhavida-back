import { Test } from "@nestjs/testing";
import { CreatePetDto } from "../dto";
import { PetsController } from "../pets.controller";
import { PetsService } from "../pets.service";
import { petStub } from "../stubs/";
import { PetsServiceMock } from "../__mocks__/pets.service";

describe("PetsController Unit", () => {
  let petsController: PetsController;
  let petsService: PetsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [
        {
          provide: PetsService,
          useClass: PetsServiceMock
        }
      ]
    }).compile();

    petsController = moduleRef.get<PetsController>(PetsController);
    petsService = moduleRef.get<PetsService>(PetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create()", () => {
    it("when create is called, it should call PetsService", async () => {
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
      const pet = await petsController.create(createPetDto);

      expect(petsService.create).toHaveBeenCalledWith(createPetDto);
      expect(pet).toEqual(petStub());
    });
  });
});
