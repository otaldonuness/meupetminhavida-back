import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signIn(dto: SignInAuthDto) {
        // Find the user by email.
        // If user does not exist throw exception.
        const user = await this.prisma.users.findUnique({
            where: {
                email: dto.email,
            },
        });
        // Guard condition.
        if (!user) {
            throw new ForbiddenException('Credentials incorrect, please try again');
        }

        // Compare passwords.
        // If passwords incorrect throw exception.
        const passwordMatches = await argon.verify(user.password, dto.password);
        if (!passwordMatches) {
            throw new ForbiddenException("Credentials incorrect, please try again");
        }
        delete user.password;
        return user;
    }

    async signUp(dto: SignUpAuthDto) {
        const hashPassword = await argon.hash(dto.password);
        try {
            const data = {
                ...dto,
                password: hashPassword,
            }
            const user = await this.prisma.users.create({data});
            delete user.password;
            return user;   
        } catch (err) {
            // Treats unique constraint from Prisma.
            if (err.code === 'P2002') {
                throw new ForbiddenException('Credentials already taken, please use other credentials');
            }
            throw err;
        }
    }
}
