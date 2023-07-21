import { Module } from "@nestjs/common"
import { SpeciesController } from "./species.controller"
import { SpeciesService } from "./species.service"

@Module({
  controllers: [SpeciesController],
  providers: [SpeciesService]
})
export class SpeciesModule {}
