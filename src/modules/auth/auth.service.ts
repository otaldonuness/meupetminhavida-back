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

  async signIn({ email, password }: SignInAuthDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        "Credentials incorrect, please try again"
      );
    }

    const passwordMatches = await argon.verify(user.hashedPassword, password);

    if (!passwordMatches) {
      throw new UnauthorizedException(
        "Credentials incorrect, please try again"
      );
    }

    return await this.signTokens({ sub: user.id, email: user.email });
  }

  async signUp(dto: CreateUserDto): Promise<TokenInfo> {
    const user = await this.usersService.create(dto);
    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
    });
    await this.usersService.updateHashRT(user.id, tokens.refreshToken);
    return tokens;
  }

  async signTokens(tokenPayload: TokenPayload): Promise<TokenInfo> {
    const accessTokenOptions = {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    };
    const refreshTokenOptions = {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(tokenPayload, accessTokenOptions),
      this.jwt.signAsync(tokenPayload, refreshTokenOptions),
    ]);

    return {
      accessToken,
      refreshToken,
      accessType: "Bearer",
    };
  }
}
