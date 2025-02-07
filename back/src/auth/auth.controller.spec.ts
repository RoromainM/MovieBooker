import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';

interface RegisterResponse {
  id: number;
  username: string;
}

interface LoginResponse {
  access_token: string;
}

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn<() => Promise<RegisterResponse>>()
              .mockResolvedValue({ id: 1, username: 'test' }),
            login: jest.fn<() => Promise<LoginResponse>>()
              .mockResolvedValue({ access_token: 'token' }),
          },
        },
        JwtService,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { id: 1, username: 'test' };
          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', username: 'test', password: 'test' };
      const expectedResult = { id: 1, username: 'test' };
      
      const result = await controller.register(registerDto);
      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signIn', () => {
    it('should call AuthService.login with correct parameters and return access token', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'test' };
      const result = await controller.signIn(loginDto);
      expect(service.login).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const req = { user: { id: 1, username: 'test' } };
      expect(controller.getProfile(req)).toBe(req.user);
    });
  });
});
