import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        this.authService.register(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiBody({
        type: LoginDto,
    })
    async signIn(@Body() loginDto: { username: string; password: string }) {
        return this.authService.login(loginDto.username, loginDto.password);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
