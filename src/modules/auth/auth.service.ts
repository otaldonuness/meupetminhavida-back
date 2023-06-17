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
    console.log({ dto, user });
    const passwordMatches = await argon.verify(user.password, dto.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credentials incorrect, please try again');
    }
    return await this.signToken({ sub: user.id, email: user.email });
  }

  async signUp(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return await this.signToken({ sub: user.id, email: user.email });
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
