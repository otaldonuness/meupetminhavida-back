import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  speciesId: number

  @IsNumber()
  @IsNotEmpty()
  locationId: number

  @IsString()
  @IsNotEmpty()
  gender: string

  @IsString()
  @IsNotEmpty()
  breed: string

  @IsNumber()
  @IsNotEmpty()
  age: number

  @IsBoolean()
  @IsNotEmpty()
  isCastrated: boolean

  @IsString()
  @IsNotEmpty()
  description: string

  @IsArray()
  @IsOptional()
  petPhotos?: Array<Object>

  @IsArray()
  @IsOptional()
  appliedVaccines?: Array<Object>

  @IsArray()
  @IsOptional()
  treatments?: Array<Object>
}
