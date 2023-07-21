import { Body, Controller, Post } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { PetsService } from "./pets.service"
import { CreatePetDto } from "./dto"

@ApiBearerAuth()
@ApiTags("pets")
@Controller("pets")
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto)
  }
}
