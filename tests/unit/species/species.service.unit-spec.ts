import {
  CreateSpeciesDto,
  UpdateSpeciesDto
} from "../../../src/modules/species/dto"
import { Test } from "@nestjs/testing"
import { PrismaMock } from "../../../src/modules/species/__mocks__/prisma-service.mock"
import { PrismaService } from "../../../src/config/prisma/prisma.service"
import { SpeciesService } from "../../../src/modules/species/species.service"
import { speciesStub } from "../../../src/modules/species/stubs"

describe("SpeciesService Unit", () => {
  let speciesService: SpeciesService
  let prismaService: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SpeciesService,
        {
          provide: PrismaService,
          useClass: PrismaMock
        }
      ]
    }).compile()

    speciesService = moduleRef.get<SpeciesService>(SpeciesService)
    prismaService = moduleRef.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("create()", () => {
    it("when create is called, it should call PrismaService", async () => {
      const createSpeciesDto: CreateSpeciesDto = {
        name: "corvus corax"
      }
      const createdSpecies = await speciesService.create(createSpeciesDto)

      expect(prismaService.species.create).toHaveBeenCalledWith({
        data: { ...createSpeciesDto }
      })
      expect(createdSpecies).toEqual(speciesStub())
    })
  })

  describe("update()", () => {
    it("when update is called, it should call PrismaService", async () => {
      const updateId = "randomID"
      const updateSpeciesDto: UpdateSpeciesDto = {
        name: "corvus corax"
      }
      const updatedSpecies = await speciesService.update(
        updateSpeciesDto,
        updateId
      )

      expect(prismaService.species.update).toHaveBeenCalledWith({
        data: { ...updatedSpecies },
        where: { id: updateId }
      })
      expect(updatedSpecies).toEqual(speciesStub())
    })
  })

  describe("delete()", () => {
    it("when delete is called, it should call PrismaService", async () => {
      const deleteId = "40022892-2a3a-5bd9-9371-0423c1e2abee"
      await speciesService.delete(deleteId)

      expect(prismaService.species.delete).toHaveBeenCalledWith({
        where: { id: deleteId }
      })
    })
  })

  describe("getById()", () => {
    it("when getById is called, it should call PrismaService", async () => {
      const searchId = "validID"
      const foundSpecies = await speciesService.getById(searchId)

      expect(prismaService.species.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: searchId }
      })
      expect(foundSpecies).toEqual(speciesStub())
    })
  })

  describe("getAll()", () => {
    it("when getAll is called, it should call PrismaService", async () => {
      const foundSpecies = await speciesService.getAll()

      expect(prismaService.species.findMany).toHaveBeenCalledWith()
      expect(foundSpecies).toEqual([speciesStub(), speciesStub()])
    })
  })
})
