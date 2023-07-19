import { Test } from "@nestjs/testing";
import { CreatePetDto } from "src/modules/pets/dto";
import { PetsController } from "src/modules/pets/pets.controller";
import { PetsService } from "src/modules/pets/pets.service";
import { petStub } from "src/modules/pets/stubs/";

jest.mock("../../../src/modules/pets/pets.service.ts");

describe("PetsController Unit", () => {
  let petsController: PetsController;
  let petsService: PetsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [PetsService],
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
        speciesId: "0334f499-a655-4d62-8f0d-2b68a5a1c93e",
        age: 12,
        gender: "m",
        breed: "akita",
        isCastrated: false,
        locationId: "00395870-a458-4fba-8bbf-e91b840524ab",
        description: "test",
        petSize: "MEDIUM",
      };

      const pet = petsController.create(createPetDto);
      expect(petsService.create).toHaveBeenCalledWith(createPetDto);
      expect(pet).toEqual(petStub());
    });
  });
});
