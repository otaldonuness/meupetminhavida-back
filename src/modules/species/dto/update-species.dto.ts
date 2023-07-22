import { PartialType } from "@nestjs/mapped-types";
import { CreateSpeciesDto } from "./create-species.dto";

export class UpdateSpeciesDto extends PartialType(CreateSpeciesDto) {}
