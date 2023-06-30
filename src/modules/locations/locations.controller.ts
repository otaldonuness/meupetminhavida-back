import { Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Res } from "@nestjs/common";
import { LocationsService } from "./locations.service";
import {
  GetLocationInputDto,
  GetLocationOutputDto,
} from "./dto/get.location.dto";
import { PublicRoute } from "src/shared/decorators";
import { response } from "express";
import { GetLocationByStateInputDto, GetLocationByStateOutputDto } from "./dto/get.locations.by.state.dto";

@PublicRoute()
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get(":id")
  async findByID(@Param("id") id: string): Promise<GetLocationOutputDto> {
    const input = new GetLocationInputDto();
    input.id = id;
    try {
      const output = await this.locationsService.findByID(input);
      return {
        id: output.id,
        city: output.city,
        state: output.state
      }       
    } catch(error) {
      if(error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND, { cause: new Error(error.message)});        
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR, { cause: new Error(error.message)});
    }
  }

  @Get("/state/:state")
  async findByState(@Param("state") state: string): Promise<GetLocationByStateOutputDto> {
    const input = new GetLocationByStateInputDto();
    input.state = state;
    try {
      const output = await this.locationsService.findByState(input);
      if(output.length === 0) {
        throw new NotFoundException("uf doesn't exist")
      }
      return {
        cities: output.map(city =>({
          id: city.id,
          city: city.city
        })),
      }
    } catch(error) {
      if(error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND, { cause: new Error(error.message)});        
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR, { cause: new Error(error.message)});
    }
  }
}
