import {
  ConflictException,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { SpeciesServiceMock } from "src/modules/species/__mocks__/species.service";
import { CreateSpeciesDto, UpdateSpeciesDto } from "src/modules/species/dto";
import { SpeciesService } from "src/modules/species/species.service";
import { speciesStub } from "src/modules/species/stubs";

jest.mock("../../../src/modules/species/species.service.ts");

describe("SpeciesService Unit", () => {
  let speciesService: SpeciesService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: SpeciesService,
          useClass: SpeciesServiceMock,
        },
      ],
    }).compile();

    speciesService = moduleRef.get<SpeciesService>(SpeciesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create()", () => {
    it("when create is called, it should call SpeciesService", async () => {
      const createSpeciesDto: CreateSpeciesDto = {
        name: "corvus corax",
      };
      const createdSpecies = await speciesService.create(createSpeciesDto);

      expect(speciesService.create).toHaveBeenCalledWith(createSpeciesDto);
      expect(createdSpecies).toEqual(speciesStub());
    });

    it("when given a bad input, it should throw a NotAcceptableException", async () => {
      const badCreateSpeciesDto: CreateSpeciesDto = {
        name: "toolongofanametoolongofanametoolongofanametoolongofaname",
      };

      await speciesService
        .create(badCreateSpeciesDto)
        .then((species) => expect(species).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(406);
          expect(err).toBeInstanceOf(NotAcceptableException);
        });
      expect(speciesService.create).toHaveBeenCalledWith(badCreateSpeciesDto);
    });

    it("when given a name of a species that is already registered, it should throw a ConflictException", async () => {
      const existentSpeciesDto: CreateSpeciesDto = {
        name: "pre-existing species",
      };

      await speciesService
        .create(existentSpeciesDto)
        .then((species) => expect(species).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(409);
          expect(err).toBeInstanceOf(ConflictException);
        });
      expect(speciesService.create).toHaveBeenCalledWith(existentSpeciesDto);
    });
  });

  describe("update()", () => {
    it("when update is called, it should call SpeciesService", async () => {
      const updateId = "randomID";
      const updateSpeciesDto: UpdateSpeciesDto = {
        name: "new name",
      };
      const updatedSpecies = await speciesService.update(
        updateSpeciesDto,
        updateId,
      );

      expect(speciesService.update).toHaveBeenCalledWith(
        updateSpeciesDto,
        updateId,
      );
      expect(updatedSpecies).toEqual(speciesStub());
    });

    it("when given an invalid id, it should throw a NotFoundException", async () => {
      const updateId = "invalidID";
      const updateSpeciesDto: UpdateSpeciesDto = {
        name: "new name",
      };

      await speciesService
        .update(updateSpeciesDto, updateId)
        .then((species) => expect(species).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(404);
          expect(err).toBeInstanceOf(NotFoundException);
        });
      expect(speciesService.update).toHaveBeenCalledWith(
        updateSpeciesDto,
        updateId,
      );
    });
  });

  it("when update is given a bad input, it should throw a NotAcceptableException", async () => {
    const updateId = "randomID";
    const badUpdateSpeciesDto: UpdateSpeciesDto = {
      name: "toolongofanametoolongofanametoolongofanametoolongofaname",
    };

    await speciesService
      .update(badUpdateSpeciesDto, updateId)
      .then((species) => expect(species).toBeUndefined())
      .catch((err) => {
        expect(err.status).toBe(406);
        expect(err).toBeInstanceOf(NotAcceptableException);
      });
    expect(speciesService.update).toHaveBeenCalledWith(
      badUpdateSpeciesDto,
      updateId,
    );
  });

  // Pra impedir algum mal-entendido, isso serve (ou deveria servir) para impedir réplicas.
  it("when updated to an already existing species, it should throw a ConflictException.", async () => {
    const updateId = "randomID";
    const existentSpeciesDto: CreateSpeciesDto = {
      name: "pre-existing species",
    };

    await speciesService
      .update(existentSpeciesDto, updateId)
      .then((species) => expect(species).toBeUndefined())
      .catch((err) => {
        expect(err.status).toBe(409);
        expect(err).toBeInstanceOf(ConflictException);
      });
    expect(speciesService.update).toHaveBeenCalledWith(
      existentSpeciesDto,
      updateId,
    );
  });

  describe("delete()", () => {
    it("when delete is called, it should call SpeciesService", async () => {
      const deleteId = "40022892-2a3a-5bd9-9371-0423c1e2abee";
      await speciesService.delete(deleteId);

      expect(speciesService.delete).toHaveBeenCalledWith(deleteId);
      // Nesse aqui, não faço ideia de qual erro pode rolar, ent deixei assim
      // Talvez um P2025 do prisma?
    });
  });

  describe("getById()", () => {
    it("when getById is called, it should call SpeciesService", async () => {
      const id = "validID";
      const foundSpecies = await speciesService.getById(id);

      expect(speciesService.getById).toHaveBeenCalledWith(id);
      expect(foundSpecies).toEqual(speciesStub());
    });

    it("when provided with an invalid id, should throw a NotFoundException", async () => {
      const invalidId = "invalidID";

      await speciesService
        .getById(invalidId)
        .then((species) => expect(species).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(404);
          expect(err).toBeInstanceOf(NotFoundException);
        });
      expect(speciesService.getById).toHaveReturnedWith(invalidId);
    });
  });

  describe("getAll()", () => {
    it("when getAll is called, it should call SpeciesService", async () => {
      const foundSpecies = await speciesService.getAll();

      expect(speciesService.getAll).toHaveBeenCalledWith();
      expect(foundSpecies).toContain(speciesStub());
    });

    it("if somehow no species are found, it should throw a NotFoundException", async () => {
      await speciesService
        .getAll()
        .then((species) => expect(species).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(404);
          expect(err).toBeInstanceOf(NotFoundException);
        });
    });
  });
});
