import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SignInAuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { TokenInfo, JwtPayload } from "./types";
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
      user?.hashedPassword || (await argon.hash("dummy-password")),
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
      role: user.role,
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
      role: user.role,
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
      role: user.role,
    });

    await this.usersService.updateHashedRefreshToken(
      user.id,
      tokens.refreshToken
    );

    return tokens;
  }

  async signTokens(jwtPayload: JwtPayload): Promise<TokenInfo> {
    const accessTokenOptions = {
      secret: this.configService.get("ACCESS_TOKEN_SECRET"),
      expiresIn: this.configService.get("ACCESS_TOKEN_EXPIRES"),
    };

    const refreshTokenOptions = {
      secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRES"),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, accessTokenOptions),
      this.jwtService.signAsync(jwtPayload, refreshTokenOptions),
    ]);

    return {
      accessToken,
      refreshToken,
      accessType: "Bearer",
    };
  }
}
