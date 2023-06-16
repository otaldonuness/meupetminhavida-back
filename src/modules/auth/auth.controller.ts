import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInAuthDto, SignUpAuthDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() dto: SignInAuthDto) {
        return await this.authService.signIn(dto);
    }

    @Post('signup')
    async signUp(@Body() dto: SignUpAuthDto) {
        return await this.authService.signUp(dto);
    }
}
