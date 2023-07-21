import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../config/prisma/prisma.service";
import { CreatePetDto } from "./dto";

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPetDto: CreatePetDto) {
    const { appliedVaccines, treatments, petPhotos, ...petData } = createPetDto;

    try {
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
    } catch (err) {
      if (err?.code === "P2019") {
        throw new NotAcceptableException("Invalid Input.");
      }
      throw err;
    }
  }

  async findPetById(id: string) {
    try {
      return await this.prisma.pets.findUniqueOrThrow({ where: { id: id } });
    } catch (err) {
      if (err?.code === "P2025") {
        throw new NotFoundException(
          "Unable to find a pet with the provided ID.",
        );
      }
      throw err;
    }
  }

  async findPetsByCityId(locationId: string) {
    try {
      return await this.prisma.pets.findMany({
        where: { locationId: locationId },
      });
    } catch (err) {
      if (err?.code === "P2025") {
        throw new NotFoundException(
          "Unable to find pets with the provideda cityID",
        );
      }
      throw err;
    }
  }
}
