import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { AuthService } from "./auth.service"
import { SignInAuthDto } from "./dto"
import { CreateUserDto } from "../users/dto"
import { TokenInfo } from "./types"
import { GetCurrentUser, PublicRoute } from "../../shared/decorators"
import { JwtRefreshGuard } from "../../shared/guards"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInAuthDto: SignInAuthDto): Promise<TokenInfo> {
    return await this.authService.signIn(signInAuthDto)
  }

  @PublicRoute()
  @Post("signup")
  async signUp(@Body() createUserDto: CreateUserDto): Promise<TokenInfo> {
    return await this.authService.signUp(createUserDto)
  }

  @ApiBearerAuth()
  @Get("signout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@GetCurrentUser("sub") userId: string): Promise<void> {
    return await this.authService.signOut(userId)
  }

  @PublicRoute()
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @Get("refresh")
  async refreshTokens(
    @GetCurrentUser("sub") userId: string,
    @GetCurrentUser("refreshToken") refreshToken: string
  ): Promise<TokenInfo> {
    return await this.authService.refreshTokens(userId, refreshToken)
  }
}
