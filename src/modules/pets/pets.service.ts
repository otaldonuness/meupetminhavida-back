import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma/prisma.service";
import { CreatePetDto } from "./dto";

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) { }

  // This 
  async create(dto: CreatePetDto,) {
    const pet = {
      ...dto,

    }


    try {
      return await this.prisma.pets.create({ data: pet })
    } catch (error) {
      throw error
    }
  }

  async findPetById(id: number) {
    return await this.prisma.pets.findUnique({ where: { id } })
  }
}
