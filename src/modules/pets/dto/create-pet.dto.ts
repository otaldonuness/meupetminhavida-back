import { PetSize } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  speciesId: string;

  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  breed: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsBoolean()
  @IsNotEmpty()
  isCastrated: boolean;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  petPhotos?: Array<Object>;

  @IsArray()
  @IsOptional()
  appliedVaccines?: Array<Object>;

  @IsArray()
  @IsOptional()
  treatments?: Array<Object>;

  @IsEnum(PetSize)
  @IsNotEmpty()
  petSize: PetSize = PetSize.SMALL;
}
