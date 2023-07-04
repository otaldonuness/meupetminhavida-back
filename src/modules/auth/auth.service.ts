import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignInAuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { TokenInfo, TokenPayload } from "./types";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signIn({ email, password }: SignInAuthDto): Promise<TokenInfo> {
    const user = await this.usersService.findOneByEmail(email);

    const passwordMatches = await argon.verify(
      user?.hashedPassword ||
        "$argon2id$v=19$m=65536,t=3,p=4$9rAOfe38IHziEcJZNTzqww$RNIaQPxnfna8VcnyW+GnnG0rKs45fUch7t+A1B24mTo",
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
      throw new UnauthorizedException("Credentials Incorrect");
    }

    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
    });

    await this.usersService.updateHashedRefreshToken(
      user.id,
      tokens.refreshToken
    );

    return tokens;
  }

  async signUp(createUserDto: CreateUserDto): Promise<TokenInfo> {
    const user = await this.usersService.create(createUserDto);

    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
    });

    await this.usersService.updateHashedRefreshToken(
      user.id,
      tokens.refreshToken
    );

    return tokens;
  }

  async signOut(userId: string): Promise<void> {
    await this.usersService.removeHashedRefreshToken(userId);
  }

  async refreshTokens(
    userId: string,
    refreshToken: string
  ): Promise<TokenInfo> {
    const user = await this.usersService.findOneById(userId);
    const isUserValid = user !== null && user.hashedRefreshToken !== null;

    const refreshTokenMatches = isUserValid
      ? await argon.verify(user.hashedRefreshToken, refreshToken)
      : false;

    if (!isUserValid || !refreshTokenMatches) {
      throw new UnauthorizedException("Access Denied");
    }

    const tokens = await this.signTokens({
      sub: user.id,
      email: user.email,
    });

    await this.usersService.updateHashedRefreshToken(
      user.id,
      tokens.refreshToken
    );

    return tokens;
  }

  async signTokens(tokenPayload: TokenPayload): Promise<TokenInfo> {
    const accessTokenOptions = {
      secret: this.configService.get("ACCESS_TOKEN_SECRET"),
      expiresIn: this.configService.get("ACCESS_TOKEN_EXPIRES"),
    };

    const refreshTokenOptions = {
      secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRES"),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, accessTokenOptions),
      this.jwtService.signAsync(tokenPayload, refreshTokenOptions),
    ]);

    return {
      accessToken,
      refreshToken,
      accessType: "Bearer",
    };
  }
}
