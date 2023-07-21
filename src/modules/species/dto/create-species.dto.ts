import { IsString, IsNotEmpty, MaxLength } from "class-validator"

export class CreateSpeciesDto {
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  name: string
}
