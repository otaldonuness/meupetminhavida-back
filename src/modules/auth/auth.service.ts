import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SignUpAuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signIn() {}

    async signUp(dto: SignUpAuthDto) {
        const hashPassword = await argon.hash(dto.password);
        const data = {
            ...dto,
            password: hashPassword,
        }
        const user = await this.prisma.users.create({data});
        return user;
    }
}
