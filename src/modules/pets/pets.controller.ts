import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "../../shared/guards";
import { PetsService } from "./pets.service";
import { CreatePetDto } from "./dto";

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags("pets")
@Controller("pets")
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  create(@Body() input: CreatePetDto) {
    return this.petsService.create(input);
  }
}
