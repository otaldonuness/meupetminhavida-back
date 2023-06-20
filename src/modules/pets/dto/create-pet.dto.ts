import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator'

export class CreatePetDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsNumber()
    @IsNotEmpty()
    caseID: number

    @IsString()
    @IsNotEmpty()
    gender: string

    @IsString()
    @IsNotEmpty()
    breed: string

    @IsArray()
    @IsNotEmpty()
    treatments: Array<Object>

    @IsNumber()
    @IsNotEmpty()
    age: number

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    type: string

    @IsArray()
    @IsNotEmpty()
    appliedVaccines: Array<Object>

    @IsBoolean()
    @IsNotEmpty()
    isCastrated: boolean
}
