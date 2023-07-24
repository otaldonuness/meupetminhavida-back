import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { LocationsService } from "./locations.service";
import { PublicRoute } from "../../../src/shared/decorators";
import {
  LocationOutputDto,
  LocationOutputListDto
} from "./dto/location-output.dto";
import { FindByCityInputDto, FindByStateInputDto } from "./dto";

@PublicRoute()
@ApiTags("locations")
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async findAll(): Promise<LocationOutputListDto> {
    const output = await this.locationsService.findAll();
    return {
      locations: output.map((location) => ({
        id: location.id,
        city: location.city,
        state: location.state
      }))
    };
  }

  @Get(":state")
  async findByState(
    @Param("state") value: FindByStateInputDto
  ): Promise<LocationOutputListDto> {
    const output = await this.locationsService.findByState(value.state);
    return {
      locations: output.map((location) => ({
        id: location.id,
        city: location.city,
        state: location.state
      }))
    };
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<LocationOutputDto> {
    const output = await this.locationsService.findById(id);
    return {
      id: output.id,
      city: output.city,
      state: output.state
    };
  }

  @Get(":name")
  async findByCityName(
    @Param("name") value: FindByCityInputDto
  ): Promise<LocationOutputDto> {
    const output = await this.locationsService.findByCity(value.city);
    return {
      id: output.id,
      city: output.city,
      state: output.state
    };
  }
}
