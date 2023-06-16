import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SignUpAuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signIn() {}

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
