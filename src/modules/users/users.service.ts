import {
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { Users, UsersRole } from '@prisma/client'
import * as argon from 'argon2'
import { PrismaService } from '../../config/prisma/prisma.service'
import { CreateUserDto } from './dto'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto): Promise<Users> {
        const { ...userRest } = createUserDto
        const { password, locationId, ...userData } = userRest

        const hashedPassword = await argon.hash(password)

        try {
            return await this.prisma.users.create({
                data: {
                    ...userData,
                    locationId, // TODO: need to verify if location exists before adding it to user.
                    hashedPassword
                }
            })
        } catch (err) {
            // Treats unique constraint from Prisma.
            if (err.code === 'P2002') {
                throw new UnauthorizedException(
                    'Credentials already taken, please use other credentials'
                )
            }
            throw err
        }
    }

    async findOneById(id: string): Promise<Users> {
        return await this.prisma.users.findUnique({ where: { id } })
    }

    async findOneByEmail(email: string): Promise<Users> {
        return await this.prisma.users.findUnique({ where: { email } })
    }

    async updateHashedRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<void> {
        const hashedRefreshToken = await argon.hash(refreshToken)
        await this.prisma.users.update({
            where: {
                id: userId
            },
            data: {
                hashedRefreshToken
            }
        })
    }

    async removeHashedRefreshToken(userId: string): Promise<void> {
        await this.prisma.users.updateMany({
            where: {
                id: userId,
                hashedRefreshToken: {
                    not: null
                }
            },
            data: {
                hashedRefreshToken: null
            }
        })
    }

    async updateUserRole(userId: string, newRole: UsersRole): Promise<Users> {
        try {
            return await this.prisma.users.update({
                where: {
                    id: userId
                },
                data: {
                    role: newRole
                }
            })
        } catch (err) {
            // Treats not found error from Prisma.
            if (err?.code === 'P2025') {
                throw new NotFoundException(
                    `User ${userId} to update role not found`
                )
            }
            throw err
        }
    }
}
