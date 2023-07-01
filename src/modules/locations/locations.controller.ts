import { Controller, Get, Param } from "@nestjs/common";
import { LocationsService } from "./locations.service";
import {
  GetLocationInputDto,
  GetLocationOutputDto,
} from "./dto/get.location.dto";
import { PublicRoute } from "src/shared/decorators";

@PublicRoute()
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get(":id")
  async findByState(@Param("id") id: string): Promise<GetLocationOutputDto> {
    const input = new GetLocationInputDto();
    input.id = id;
    return await this.locationsService.findByID(input);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.locationsService.findOne(+id);
  // }
}
