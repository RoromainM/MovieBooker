import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { beforeEach, describe, it, expect, jest, afterEach } from '@jest/globals';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn<() => Promise<User | null>>(),
      findMany: jest.fn<() => Promise<User[]>>(),
      create: jest.fn<() => Promise<User>>(),
      update: jest.fn<() => Promise<User>>(),
      delete: jest.fn<() => Promise<User>>(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user', () => {
    it('should return a user by unique input', async () => {
      const mockUser: User = { id: 1, email: 'test@example.com', username: 'test', password: 'password' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const user = await service.user({ id: 1 });
      expect(user).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      expect(await service.user({ id: 1 })).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('users', () => {
    it('should return an array of users', async () => {
      const result: User[] = [{ id: 1, email: 'test@example.com', username: 'test', password: 'password' }];
      mockPrismaService.user.findMany.mockResolvedValue(result);

      expect(await service.users({})).toEqual(result);
      expect(prisma.user.findMany).toHaveBeenCalledWith({});
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const data: Prisma.UserCreateInput = { 
        email: 'test@example.com', 
        username: 'test', 
        password: 'password' 
      };
      const result = { 
        id: 1, 
        email: data.email, 
        username: data.username, 
        password: 'hashedpassword' 
      } as User;
      
      mockPrismaService.user.create.mockResolvedValue(result);

      const user = await service.createUser(data);
      
      expect(user).toEqual(result);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: data.email,
          username: data.username,
          password: expect.any(String) // Use expect.any(String) for hashed password
        }
      });
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if creation fails', async () => {
      const data: Prisma.UserCreateInput = { email: 'test@example.com', username: 'test', password: 'password' };
      mockPrismaService.user.create.mockRejectedValue(new Error('Database error'));

      await expect(service.createUser(data)).rejects.toThrow('Database error');
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const params = { where: { id: 1 }, data: { email: 'updated@example.com' } };
      const result = { id: 1, email: 'updated@example.com', username: 'test', password: 'password' } as User;
      mockPrismaService.user.update.mockResolvedValue(result);

      expect(await service.updateUser(params)).toEqual(result);
      expect(prisma.user.update).toHaveBeenCalledWith(params);
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if update fails', async () => {
      const params = { where: { id: 1 }, data: { email: 'updated@example.com' } };
      mockPrismaService.user.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.updateUser(params)).rejects.toThrow('Update failed');
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = { id: 1, email: 'test@example.com', username: 'test', password: 'password' } as User;
      mockPrismaService.user.delete.mockResolvedValue(result);

      expect(await service.deleteUser({ id: 1 })).toEqual(result);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if deletion fails', async () => {
      mockPrismaService.user.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(service.deleteUser({ id: 1 })).rejects.toThrow('Delete failed');
      expect(prisma.user.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const result = { id: 1, email: 'test@example.com', username: 'test', password: 'password' } as User;
      mockPrismaService.user.findUnique.mockResolvedValue(result);

      expect(await service.findOne('test')).toEqual(result);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { username: 'test' } });
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      expect(await service.findOne('test')).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [{ id: 1, email: 'test@example.com', username: 'test', password: 'password' }];
      mockPrismaService.user.findMany.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
