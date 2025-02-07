import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findAll: jest.fn<() => Promise<User[]>>(),
    findOne: jest.fn<() => Promise<User | null>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        { id: 1, email: 'user1@example.com', username: 'user1', password: 'pass1' },
        { id: 2, email: 'user2@example.com', username: 'user2', password: 'pass2' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toBe(users);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no users exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const user: User = { id: 1, email: 'test@example.com', username: 'test', password: 'password' };
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne('test');

      expect(result).toBe(user);
      expect(service.findOne).toHaveBeenCalledWith('test');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      const result = await controller.findOne('unknownUser');

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith('unknownUser');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
