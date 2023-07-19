import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/config/prisma/prisma.service";
import { CreateSpeciesDto, UpdateSpeciesDto } from "./dto";

@Injectable()
export class SpeciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpeciesDto: CreateSpeciesDto) {
    try {
      return this.prisma.species.create({ data: { ...createSpeciesDto } });
    } catch (err) {
      if (err?.code === "P2002") {
        throw new ConflictException("That species is already registered.");
      }
      throw err;
    }
  }

  async update(updateSpeciesDto: UpdateSpeciesDto, id: string) {
    try {
      return await this.prisma.species.update({
        where: { id },
        data: { ...updateSpeciesDto },
      });
    } catch (err) {
      if (err?.code === "P2002") {
        throw new ConflictException(
          "Unable to update. That species is already registered.",
        );
      }
      throw err;
    }
  }

  async delete(id: string) {
    return await this.prisma.species.delete({ where: { id } });
  }

  async getAll() {
    return await this.prisma.species.findMany();
  }

  async getById(id: string) {
    try {
      return await this.prisma.species.findUniqueOrThrow({ where: { id } });
    } catch (err) {
      if (err?.code === "P2025") {
        throw new NotFoundException(
          "There is no registered species that matches the provided ID",
        );
      }
      throw err;
    }
  }
}
