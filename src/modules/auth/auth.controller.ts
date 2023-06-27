import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignInAuthDto } from "./dto";
import { CreateUserDto } from "../users/dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signin")
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInAuthDto: SignInAuthDto) {
    return await this.authService.signIn(signInAuthDto);
  }

  @Post("signup")
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }
}
