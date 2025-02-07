import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/interface/user.interface';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; 
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

@Injectable()
export class AuthService {
    private readonly users: User[] =  [];
    
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto): Promise<User> {
        const { email, username, password } = registerDto;
        const existingUser = await this.userService.findOne(username);
        if (existingUser) {
          throw new UnauthorizedException('User already exists');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, username, password: hashedPassword };
        return this.userService.createUser(newUser);
    }
    
    async login(username: string, pass: string): Promise<{ access_token: string }> {
        const user = await this.userService.findOne(username);
        if (!user) {
          throw new UnauthorizedException('Invalid username');
        }
    
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid password');
        }
    
        const payload = { sub: user.id, username: user.username };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
}
