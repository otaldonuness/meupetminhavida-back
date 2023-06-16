import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInAuthDto, SignUpAuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { TokenInfo, TokenPayload } from './types';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

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
        return await this.signToken({ userId: user.id, email: user.email });
    }

    async signUp(dto: SignUpAuthDto) {
        const hashPassword = await argon.hash(dto.password);
        try {
            const data = {
                ...dto,
                password: hashPassword,
            }
            const user = await this.prisma.users.create({data});
            return await this.signToken({ userId: user.id, email: user.email });
        } catch (err) {
            // Treats unique constraint from Prisma.
            if (err.code === 'P2002') {
                throw new ForbiddenException('Credentials already taken, please use other credentials');
            }
            throw err;
        }
    }

    async signToken(tokenPayload: TokenPayload): Promise<TokenInfo> {
        const payload = {
            sub: tokenPayload.userId,
            email: tokenPayload.email,
        }
        const token = await this.jwt.signAsync(payload, {
            expiresIn: process.env.TOKEN_EXPIRES,
            secret: process.env.JWT_SECRET,
        });
        return {
            accessToken: token,
            accessType: 'Bearer',
        }
    }
}
