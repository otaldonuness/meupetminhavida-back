import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signIn() {
        return 'I am sign in'
    }

    @Post('signup')
    async signUp(@Body() dto: SignUpAuthDto) {
        console.log({dto});
        return await this.authService.signUp(dto);
    }
}
