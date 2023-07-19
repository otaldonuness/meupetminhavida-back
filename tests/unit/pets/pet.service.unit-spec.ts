import { NotAcceptableException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PetsServiceMock } from "src/modules/pets/__mocks__";
import { CreatePetDto } from "src/modules/pets/dto";
import { PetsService } from "src/modules/pets/pets.service";
import { petStub } from "src/modules/pets/stubs/pets.stub";

jest.mock("../../../src/modules/pets/pets.service.ts");

describe("PetsService Unit", () => {
  let petsService: PetsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: PetsService,
          useClass: PetsServiceMock,
        },
      ],
    }).compile();

    petsService = moduleRef.get<PetsService>(PetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create()", () => {
    it("when create is called, it should call petsService", async () => {
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

      const createdPet = await petsService.create(createPetDto);
      expect(petsService.create).toHaveBeenCalledWith(createPetDto);
      expect(createdPet).toEqual(petStub());
    });

    it("given an invalid input, it should return an error", async () => {
      const invalidCreateDto: CreatePetDto = {
        name: "invalid",
        speciesId: "error",
        age: 1,
        gender: "f",
        breed: "pug",
        isCastrated: true,
        locationId: "nowhere",
        description: "invalid",
        petSize: "LARGE",
      };

      await petsService
        .create(invalidCreateDto)
        .then((pet) => expect(pet).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(406);
          expect(err).toBeInstanceOf(NotAcceptableException);
        });
      expect(petsService.create).toHaveBeenCalledWith(invalidCreateDto);
    });
  });

  describe("findPetById()", () => {
    it("when findPetById is called, it should call PetsService", async () => {
      const id = "testID";
      const foundPet = await petsService.findPetById(id);
      expect(petsService.findPetById).toHaveBeenCalledWith(id);

      // NOT SURE IF THIS EXPECT HERE MAKES SENSE. DO CHANGE IT IF IT DOESN'T
      expect(foundPet).toEqual(petStub());
    });

    it("when provided with an invalid id, should return an error and throw a NotFoundException", async () => {
      const invalidId = "invalidID";
      await petsService
        .findPetById(invalidId)
        .then((pet) => expect(pet).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(404);
          expect(err).toBeInstanceOf(NotFoundException);
        });
      expect(petsService.findPetById).toHaveBeenCalledWith(invalidId);
    });
  });

  describe("findPetByCityId()", () => {
    it("when findPetsByCityId is called, it should call PetsService", async () => {
      const cityId = "00395870-a458-4fba-8bbf-e91b840524ab";
      const foundPets = await petsService.findPetsByCityId(cityId);
      expect(petsService.findPetsByCityId).toHaveBeenCalledWith(cityId);

      // Like I said above, I'm not sure if this expect should be like this or if it
      // should even be here. In case it shouldn't, change it or remove it as you see fit
      expect(foundPets).toContain(petStub());
    });

    it("when provided with an invalid city ID, it should return an error and throw a NotFoundException", async () => {
      const invalidCityId = "invalidID";
      await petsService
        .findPetsByCityId(invalidCityId)
        .then((pet) => expect(pet).toBeUndefined())
        .catch((err) => {
          expect(err.status).toEqual(404);
          expect(err).toBeInstanceOf(NotFoundException);
        });
      expect(petsService.findPetsByCityId).toHaveBeenCalledWith(invalidCityId);
    });
  });
});
