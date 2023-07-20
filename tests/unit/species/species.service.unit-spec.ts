import {
  ConflictException,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "src/config/prisma/prisma.service";
import { PrismaMock } from "src/modules/species/__mocks__/prisma-service.mock";
import { CreateSpeciesDto, UpdateSpeciesDto } from "src/modules/species/dto";
import { SpeciesService } from "src/modules/species/species.service";
import { speciesStub } from "src/modules/species/stubs";

jest.mock("../../../src/modules/species/species.service.ts");

describe("SpeciesService Unit", () => {
  let speciesService: SpeciesService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SpeciesService,
        {
          provide: PrismaService,
          useClass: PrismaMock,
        },
      ],
    }).compile();

    speciesService = moduleRef.get<SpeciesService>(SpeciesService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create()", () => {
    it("when create is called, it should call PrismaService", async () => {
      const createSpeciesDto: CreateSpeciesDto = {
        name: "corvus corax",
      };
      const createdSpecies = await speciesService.create(createSpeciesDto);

      expect(prismaService.species.create).toHaveBeenCalledWith({
        data: { ...createSpeciesDto },
      });
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
      expect(prismaService.species.create).toHaveBeenCalledWith({
        data: { ...badCreateSpeciesDto },
      });
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
      expect(prismaService.species.create).toHaveBeenCalledWith({
        data: { ...existentSpeciesDto },
      });
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

      expect(prismaService.species.update).toHaveBeenCalledWith({
        data: { ...updatedSpecies },
        where: { id: updateId },
      });
      expect(updatedSpecies).toEqual(speciesStub());
    });

    it("when given an invalid id, it should throw a NotFoundException", async () => {
      const invalidId = "invalidID";
      const updateSpeciesDto: UpdateSpeciesDto = {
        name: "new name",
      };

      await speciesService
        .update(updateSpeciesDto, invalidId)
        .then((species) => expect(species).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(404);
          expect(err).toBeInstanceOf(NotFoundException);
        });
      expect(prismaService.species.update).toHaveBeenCalledWith({
        data: { ...updateSpeciesDto },
        where: { id: invalidId },
      });
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
    expect(prismaService.species.update).toHaveBeenCalledWith({
      data: { ...badUpdateSpeciesDto },
      where: { id: updateId },
    });
  });

  // Isso serve (ou deveria servir) para impedir réplicas.
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
    expect(prismaService.species.update).toHaveBeenCalledWith({
      data: { ...UpdateSpeciesDto },
      where: { id: updateId },
    });
  });

  describe("delete()", () => {
    it("when delete is called, it should call SpeciesService", async () => {
      const deleteId = "40022892-2a3a-5bd9-9371-0423c1e2abee";
      await speciesService.delete(deleteId);

      expect(prismaService.species.delete).toHaveBeenCalledWith({
        where: { id: deleteId },
      });
      // Nesse aqui, não faço ideia de qual erro pode rolar, ent deixei assim
      // Talvez um P2025 do prisma?
    });
  });

  describe("getById()", () => {
    it("when getById is called, it should call SpeciesService", async () => {
      const searchId = "validID";
      const foundSpecies = await speciesService.getById(searchId);

      expect(prismaService.species.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: searchId },
      });
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
      expect(prismaService.species.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: invalidId },
      });
    });
  });

  describe("getAll()", () => {
    it("when getAll is called, it should call SpeciesService", async () => {
      const foundSpecies = await speciesService.getAll();

      expect(prismaService.species.findMany).toHaveBeenCalledWith();
      expect(foundSpecies).toBe([speciesStub(), speciesStub()]);
    });

    it("if somehow no species are found, it should throw a NotFoundException", async () => {
      await speciesService
        .getAll()
        .then((species) => expect(species).toBeUndefined())
        .catch((err) => {
          expect(err.status).toBe(404);
          expect(err).toBeInstanceOf(NotFoundException);
        });
      expect(prismaService.species.findMany).toHaveBeenCalledWith();
    });
  });
});
