import { Locations } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../config/prisma/prisma.service";

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Locations[]> {
    try {
      return await this.prisma.locations.findMany();
    } catch (err) {
      throw err;
    }
  }

  async findByCity(city: string): Promise<Locations> {
    try {
      return await this.prisma.locations.findFirst({
        where: {
          city: city
        }
      });
    } catch (err) {
      if (err.code === "P2025") {
        throw new NotFoundException("No location has been found");
      }
      throw err;
    }
  }

  async findByState(state: string): Promise<Locations[]> {
    try {
      return await this.prisma.locations.findMany({
        where: {
          state: state
        }
      });
    } catch (err) {
      throw err;
    }
  }

  async findById(id: string): Promise<Locations> {
    try {
      return await this.prisma.locations.findUniqueOrThrow({
        where: { id }
      });
    } catch (err) {
      if (err.code === "P2025") {
        throw new NotFoundException(`Location ${id} was not found`);
      }
      throw err;
    }
  }
}
