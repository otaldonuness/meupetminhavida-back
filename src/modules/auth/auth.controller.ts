import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignInAuthDto } from "./dto";
import { CreateUserDto } from "../users/dto";
import { TokenInfo } from "./types";

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
}
