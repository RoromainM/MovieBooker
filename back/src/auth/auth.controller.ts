import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        this.authService.register(registerDto);
    }

    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: { username: string; password: string }) {
        return this.authService.login(signInDto.username, signInDto.password);
    }
}
