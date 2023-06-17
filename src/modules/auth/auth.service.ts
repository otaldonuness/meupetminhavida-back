import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInAuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { TokenInfo, TokenPayload } from './types';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwt: JwtService) {}

  async signIn(dto: SignInAuthDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credentials incorrect, please try again');
    }

    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credentials incorrect, please try again');
    }
    return await this.signToken({ sub: user.id, email: user.email });
  }

  async signUp(dto: CreateUserDto) {
    const hashPassword = await argon.hash(dto.password);
    try {
      const data = {
        ...dto,
        password: hashPassword,
      };
      const user = await this.usersService.create(data);
      return await this.signToken({ sub: user.id, email: user.email });
    } catch (err) {
      // Treats unique constraint from Prisma.
      if (err.code === 'P2002') {
        throw new UnauthorizedException('Credentials already taken, please use other credentials');
      }
      throw err;
    }
  }

  async signToken(tokenPayload: TokenPayload): Promise<TokenInfo> {
    const payload = {
      sub: tokenPayload.sub,
      email: tokenPayload.email,
    };
    return {
      accessToken: await this.jwt.signAsync(payload),
      accessType: 'Bearer',
    };
  }
}
