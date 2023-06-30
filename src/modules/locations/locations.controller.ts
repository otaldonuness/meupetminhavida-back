import { Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Res } from "@nestjs/common";
import { LocationsService } from "./locations.service";
import {
  GetLocationInputDto,
  GetLocationOutputDto,
} from "./dto/get.location.dto";
import { PublicRoute } from "src/shared/decorators";
import { response } from "express";

@PublicRoute()
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get(":id")
  async findByState(@Param("id") id: string): Promise<GetLocationOutputDto> {
    const input = new GetLocationInputDto();
    input.id = id;
    try {
      return await this.locationsService.findByID(input);      
    } catch(error) {
      if(error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND, { cause: new Error(error.message)});        
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR, { cause: new Error(error.message)});
    }
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.locationsService.findOne(+id);
  // }
}
