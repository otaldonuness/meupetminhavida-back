import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { SpeciesService } from './species.service'
import { CreateSpeciesDto, UpdateSpeciesDto } from './dto'

@ApiBearerAuth()
@ApiTags('species')
@Controller('species')
export class SpeciesController {
    constructor(private readonly speciesService: SpeciesService) {}

    @Post()
    create(@Body() species: CreateSpeciesDto) {
        return this.speciesService.create(species)
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.speciesService.delete(id)
    }

    @Patch(':id')
    update(@Body() species: UpdateSpeciesDto, @Param('id') id: string) {
        return this.speciesService.update(species, id)
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.speciesService.getById(id)
    }

    @Get()
    getAll() {
        return this.speciesService.getAll()
    }
}
