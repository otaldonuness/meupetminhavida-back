import { Locations } from '@prisma/client'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../src/config/prisma/prisma.service'
import { LocationsQueryDto } from './dto'

@Injectable()
export class LocationsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(query: LocationsQueryDto): Promise<Locations[]> {
        const { state, city } = query

        // TODO: refactor logic.
        // Rule 1: If no query is passed, return all locations
        // Rule 2: If state is passed but city is not, filter locations only by state
        // Rule 3: If city is passed but state is not, filter locations only by city
        // Rule 4: If both state and city are passed, filter using both values

        if (!Object.keys(query).length) {
            return this.prisma.locations.findMany()
        }

        return await this.prisma.locations.findMany({
            where: {
                OR: [
                    state && !city
                        ? { state: { equals: state.toLocaleLowerCase() } }
                        : null,
                    city && !state
                        ? { city: { equals: city.toLocaleLowerCase() } }
                        : null,
                    state && city
                        ? {
                              state: { equals: state.toLocaleLowerCase() },
                              city: { equals: city.toLocaleLowerCase() }
                          }
                        : null
                ].filter(Boolean)
            }
        })
    }

    async findById(id: string): Promise<Locations> {
        try {
            return await this.prisma.locations.findUniqueOrThrow({
                where: { id }
            })
        } catch (err) {
            // Treats not found entity by Prisma.
            if (err.code === 'P2025') {
                throw new NotFoundException(`Location ${id} was not found`)
            }
            throw err
        }
    }
}
