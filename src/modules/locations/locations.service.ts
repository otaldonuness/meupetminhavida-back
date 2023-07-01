import { Injectable } from "@nestjs/common";
import {
  GetLocationInputDto,
  GetLocationOutputDto,
} from "./dto/get.location.dto";
import { PrismaService } from "../../../src/config/prisma/prisma.service";
import { GetLocationByStateInputDto } from "./dto/get.locations.by.state.dto";

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async findByID(input: GetLocationInputDto): Promise<GetLocationOutputDto> {
    const location = await this.prisma.locations.findFirstOrThrow({
      where: { id: input.id },
    });

    const output = new GetLocationOutputDto();
    output.id = location.id;
    output.city = location.city;
    output.state = location.state;

    return output;
  }

  findByState(input: GetLocationByStateInputDto) {
    return "todo";
  }
}
