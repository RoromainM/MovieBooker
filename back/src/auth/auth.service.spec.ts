import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw an error if user already exists', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', username: 'test', password: 'test' };
      jest.spyOn(userService, 'findOne').mockResolvedValue({} as any);

      await expect(service.register(registerDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should create a new user if user does not exist', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', username: 'test', password: 'test' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);
      jest.spyOn(userService, 'createUser').mockResolvedValue({ id: 1, email: 'test@example.com', username: 'test' } as any);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await service.register(registerDto);

      expect(userService.findOne).toHaveBeenCalledWith('test');
      expect(bcrypt.hash).toHaveBeenCalledWith('test', 10);
      expect(userService.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        username: 'test',
        password: 'hashedPassword',
      });
      expect(result).toEqual({ id: 1, email: 'test@example.com', username: 'test' });
    });
  });

  describe('login', () => {
    it('should throw an error if user does not exist', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      await expect(service.login('test', 'test')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if password is invalid', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue({ username: 'test', password: 'hashedPassword' } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login('test', 'test')).rejects.toThrow(UnauthorizedException);
    });

    it('should return an access token if credentials are valid', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue({ id: 1, username: 'test', password: 'hashedPassword' } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login('test', 'test');

      expect(userService.findOne).toHaveBeenCalledWith('test');
      expect(bcrypt.compare).toHaveBeenCalledWith('test', 'hashedPassword');
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 1, username: 'test' });
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
