import { Injectable, NotFoundException } from "@nestjs/common";
import { GetLocationInputDto } from "./dto/get.location.dto";
import { PrismaService } from "src/config/prisma/prisma.service";
import { GetLocationByStateInputDto } from "./dto/get.locations.by.state.dto";
import { Location } from "./entities/location.entity";

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async findByID(input: GetLocationInputDto): Promise<Location> {
    try {
      const location = await this.prisma.locations.findFirstOrThrow({
        where: { id: input.id },
      });
      const output = new Location(location.id, location.city, location.state);
      return output;
    } catch (error) {
      if (error.constructor.name === "NotFoundError") {
        console.log("locations:get:: city not found");
        throw new NotFoundException("city not found");
      }
      console.log("locations:get:: unexpected error:" + error);
      throw new Error("unexpected error");
    }
  }

  async findByState(input: GetLocationByStateInputDto): Promise<Location[]> {
    try {
      const cities = await this.prisma.locations.findMany({
        where: { state: input.state },
      });
      if (cities === undefined) {
        throw new NotFoundException("cities not found or state doesnt exist");
      }
      return cities.map((city) => new Location(city.id, city.city, city.state));
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log(
          "locations:get:: cities of state " +
            input.state +
            "were not found: " +
            error
        );
      }
      console.log("locations:get:: unexpected error:" + error);
      throw new Error("unexpected error");
    }
  }
}
