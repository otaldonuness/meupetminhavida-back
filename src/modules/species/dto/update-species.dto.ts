import { PartialType } from "@nestjs/mapped-types";
import { CreateSpeciesDto } from "./create-species.dto";

export class UpdatePetDto extends PartialType(CreateSpeciesDto) {}
