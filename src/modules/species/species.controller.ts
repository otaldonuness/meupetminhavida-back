import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SpeciesService } from "./species.service";
import { CreateSpeciesDto } from "./dto";

@ApiBearerAuth()
@ApiTags("species")
@Controller("species")
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  create(@Param("name") name: CreateSpeciesDto) {
    return this.speciesService.create(name);
  }

  @Post("delete")
  delete(@Param("id") id: string) {
    return this.speciesService.delete(id);
  }

  @Post("update")
  update(@Param("species") species: CreateSpeciesDto, @Param("id") id: string) {
    return this.speciesService.update(species, id);
  }

  @Get()
  getAll() {
    return this.speciesService.getAll();
  }

  @Get(":id")
  getByID(@Param("id") id: string) {
    this.speciesService.getById(id);
  }
}
