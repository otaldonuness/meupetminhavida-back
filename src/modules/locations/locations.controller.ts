import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Locations } from "@prisma/client";
import { LocationsService } from "./locations.service";
import { PublicRoute } from "../../../src/shared/decorators";
import { LocationsQueryDto } from "./dto";

@PublicRoute()
@ApiTags("locations")
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async findAll(@Query() query: LocationsQueryDto): Promise<Locations[]> {
    return await this.locationsService.findAll(query);
  }

  @Get(":id")
  async findById(@Param() id: string): Promise<Locations> {
    return await this.locationsService.findById(id);
  }
}
