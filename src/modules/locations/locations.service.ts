import { Injectable, NotFoundException } from "@nestjs/common";
import {
  GetLocationInputDto,
  GetLocationOutputDto,
} from "./dto/get.location.dto";
import { PrismaService } from "src/config/prisma/prisma.service";
import { GetLocationByStateInputDto } from "./dto/get.locations.by.state.dto";
import { NotFoundError } from "rxjs";

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async findByID(input: GetLocationInputDto): Promise<GetLocationOutputDto> {
    try {
      const location = await this.prisma.locations.findFirstOrThrow({
        where: { id: input.id },
      });
      const output = new GetLocationOutputDto();
      output.id = location.id;
      output.city = location.city;
      output.state = location.state;
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

  findByState(input: GetLocationByStateInputDto) {
    return "todo";
  }
}
