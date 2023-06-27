import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignInAuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { TokenInfo, TokenPayload } from "./types";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwt: JwtService) {}

  async signIn({ email, password }: SignInAuthDto): Promise<TokenInfo> {
    const user = await this.usersService.findOneByEmail(email);

    const passwordMatches = await argon.verify(
      user?.password || "meupetminhavida-dummy",
      password,
      {
        timeCost: 3,
        memoryCost: 2 ** 16,
        parallelism: 2,
        type: argon.argon2id,
        hashLength: 32,
      }
    );

    if (!passwordMatches || !user) {
      throw new UnauthorizedException(
        "Credentials incorrect, please try again"
      );
    }

    return await this.signToken({ sub: user.id, email: user.email });
  }

  async signUp(createUserDto: CreateUserDto): Promise<TokenInfo> {
    const user = await this.usersService.create(createUserDto);

    return await this.signToken({ sub: user.id, email: user.email });
  }

  async signToken(tokenPayload: TokenPayload): Promise<TokenInfo> {
    const payload: TokenPayload = {
      sub: tokenPayload.sub,
      email: tokenPayload.email,
    };

    return {
      accessToken: await this.jwt.signAsync(payload),
      accessType: "Bearer",
    };
  }
}
