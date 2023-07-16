/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/config/prisma/prisma.service";
import { CreateSpeciesDto } from "./dto";

@Injectable()
export class SpeciesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(CreateSpeciesDto: CreateSpeciesDto) {
    try {
      this.prisma.species.create({ data: { ...CreateSpeciesDto } })
    }
    catch (err) {
      if (err.code === 'P2002') {
        throw new UnauthorizedException("That species is alredy registered");
      }
    }
  }

  async update(species: CreateSpeciesDto, id: string) {
    await this.prisma.species.update({
      where: { id },
      data: { ...species }
    })
  }

  async delete(id: string) {
    this.prisma.species.delete({ where: { id } })
  }

  async getAll() {
    return await this.prisma.species.findMany();
  }

  async getById(id: string) {
    try {
      return await this.prisma.species.findUniqueOrThrow({ where: { id } });
    } catch (err) {
      if (err.code === "P2025") {
        throw new NotFoundException("There is no registered species that matches the provided ID");
      }
      throw err;
    }
  }
}
