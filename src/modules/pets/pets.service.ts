import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../config/prisma/prisma.service";
import { CreatePetDto } from "./dto";

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(createPetDto: CreatePetDto) {
    try {
      const { appliedVaccines, treatments, petPhotos, ...petData } =
        createPetDto;

      return await this.prisma.pets.create({
        data: {
          ...petData,
          appliedVaccines: { connect: appliedVaccines },
          treatments: { connect: treatments },
          petPhotos: { connect: petPhotos },
        },
        include: {
          appliedVaccines: true,
          treatments: true,
          petPhotos: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findPetById(id: string) {
    return await this.prisma.pets.findUnique({ where: { id } });
  }

  async findPetsByCityId(locationId: string) {
    return await this.prisma.pets.findMany({ where: { locationId } });
  }
}
