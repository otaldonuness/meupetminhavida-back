import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma/prisma.service";
import { CreatePetDto } from "./dto";

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePetDto) {
    try {
      return await this.prisma.pets.create({
        data: {
          // Although it is tempting to  simply put a  ...dto instead of passing
          // the values field  by field, ...dto doesn't work.
          // Why? No idea, it just doesn't.
          name: dto.name,
          age: dto.age,
          breed: dto.breed,
          gender: dto.gender,
          isCastrated: dto.isCastrated,
          description: dto.description,
          locationId: dto.locationId,
          speciesId: dto.speciesId,
          appliedVaccines: { connect: dto.appliedVaccines },
          treatments: { connect: dto.treatments },
          petPhotos: { connect: dto.petPhotos },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findPetById(id: number) {
    return await this.prisma.pets.findUnique({ where: { id } });
  }

  async findPetsByCityId(locationId: number) {
    return await this.prisma.pets.findMany({ where: { locationId } });
  }
}
