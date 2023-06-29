import { PartialType } from "@nestjs/swagger";
import { CreateLocationDto } from "./get-locations-by-state.dto";

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
