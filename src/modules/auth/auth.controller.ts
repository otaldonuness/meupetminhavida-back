import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignInAuthDto } from "./dto";
import { CreateUserDto } from "../users/dto";
import { TokenInfo } from "./types";
import { JwtGuard, JwtRefreshGuard } from "../../shared/guards";
import { GetCurrentUser } from "../../shared/decorators";
import { Request } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: SignInAuthDto): Promise<TokenInfo> {
    return this.authService.signIn(dto);
  }

  @Post("signup")
  signUp(@Body() dto: CreateUserDto): Promise<TokenInfo> {
    return this.authService.signUp(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get("signout")
  @HttpCode(HttpStatus.NO_CONTENT)
  signOut(@GetCurrentUser("sub") userId: string): void {
    this.authService.signOut(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Get("refresh")
  refreshTokens(
    @GetCurrentUser("sub") userId: string,
    @GetCurrentUser("refreshToken") refreshToken: string
  ): Promise<TokenInfo> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
