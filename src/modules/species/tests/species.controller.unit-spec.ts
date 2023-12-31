import { Test } from "@nestjs/testing";
import { CreateSpeciesDto, UpdateSpeciesDto } from "../dto";
import { SpeciesService } from "../species.service";
import { SpeciesController } from "../species.controller";
import { speciesStub } from "../stubs";
import { SpeciesServiceMock } from "../__mocks__/species.service";

describe("SpeciesController Unit", () => {
  let speciesController: SpeciesController;
  let speciesService: SpeciesService;

  jest.mock("../species.service");

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SpeciesController],
      providers: [
        {
          provide: SpeciesService,
          useClass: SpeciesServiceMock
        }
      ]
    }).compile();

    speciesService = moduleRef.get<SpeciesService>(SpeciesService);
    speciesController = moduleRef.get<SpeciesController>(SpeciesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create()", () => {
    it("when create is called, it should call SpeciesService", async () => {
      const createSpeciesDto: CreateSpeciesDto = {
        name: "corvus corax"
      };
      const createdSpecies = await speciesController.create(createSpeciesDto);

      expect(speciesService.create).toHaveBeenCalledWith(createSpeciesDto);
      expect(createdSpecies).toEqual(speciesStub());
    });
  });

  describe("update()", () => {
    it("when update is called, it should call SpeciesService", async () => {
      const updateId = "40022892-2a3a-5bd9-9371-0423c1e2abee";
      const updateSpeciesDto: UpdateSpeciesDto = {
        name: "corvus corax"
      };
      const updatedSpecies = await speciesController.update(
        updateSpeciesDto,
        updateId
      );

      expect(speciesService.update).toHaveBeenCalledWith(
        updateSpeciesDto,
        updateId
      );
      expect(updatedSpecies).toEqual(speciesStub());
    });
  });

  describe("delete()", () => {
    it("when delete is called, it should call SpeciesService", async () => {
      const deleteId = "40022892-2a3a-5bd9-9371-0423c1e2abee";
      await speciesController.delete(deleteId);

      expect(speciesService.delete).toHaveBeenCalledWith(deleteId);
    });
  });

  describe("getById()", () => {
    it("when getById is called, it should call SpeciesService", async () => {
      const id = "40022892-2a3a-5bd9-9371-0423c1e2abee";
      const foundSpecies = await speciesController.getById(id);

      expect(speciesService.getById).toHaveBeenCalledWith(id);
      expect(foundSpecies).toEqual(speciesStub());
    });
  });

  describe("getAll()", () => {
    it("when getAll is called, it should call SpeciesService", async () => {
      const foundSpecies = await speciesController.getAll();

      expect(speciesService.getAll).toHaveBeenCalledWith();
      expect(foundSpecies).toEqual([speciesStub(), speciesStub()]);
    });
  });
});
