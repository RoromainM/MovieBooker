import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
            register: jest.fn().mockResolvedValue({}),
            login: jest.fn().mockResolvedValue({ access_token: 'token' }),
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
    it('should call AuthService.register with correct parameters', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', username: 'test', password: 'test' };
      await controller.register(registerDto);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('signIn', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto: LoginDto = { username: 'test', password: 'test' };
      await controller.signIn(loginDto);
      expect(service.login).toHaveBeenCalledWith(loginDto.username, loginDto.password);
    });

    it('should return the result of AuthService.login', async () => {
      const result = { access_token: 'token' };
      jest.spyOn(service, 'login').mockResolvedValue(result);
      expect(await controller.signIn({ username: 'test', password: 'test' })).toBe(result);
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const req = { user: { id: 1, username: 'test' } };
      expect(controller.getProfile(req)).toBe(req.user);
    });
  });
});
