import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignInAuthDto } from "./dto";
import { CreateUserDto } from "../users/dto";
import { TokenInfo } from "./types";
import { GetCurrentUser, PublicRoute } from "../../shared/decorators";
import { JwtRefreshGuard } from "src/shared/guards";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicRoute()
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: SignInAuthDto): Promise<TokenInfo> {
    return this.authService.signIn(dto);
  }

  @PublicRoute()
  @Post("signup")
  signUp(@Body() dto: CreateUserDto): Promise<TokenInfo> {
    return this.authService.signUp(dto);
  }

  @ApiBearerAuth()
  @Get("signout")
  @HttpCode(HttpStatus.NO_CONTENT)
  signOut(@GetCurrentUser("sub") userId: string): void {
    this.authService.signOut(userId);
  }

  @PublicRoute()
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @Get("refresh")
  refreshTokens(
    @GetCurrentUser("sub") userId: string,
    @GetCurrentUser("refreshToken") refreshToken: string
  ): Promise<TokenInfo> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
