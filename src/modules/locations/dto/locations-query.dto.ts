import { IsOptional, IsString, Length } from 'class-validator'

export class LocationsQueryDto {
    @IsOptional()
    @IsString()
    city?: string

    @IsOptional()
    @IsString()
    @Length(2)
    state?: string
}
