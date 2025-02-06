import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user', () => {
    it('should return a user by unique input', async () => {
      const result = { id: 1, email: 'test@example.com', username: 'test', password: 'password' } as User;
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(result);

      expect(await service.user({ id: 1 })).toBe(result);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      expect(await service.user({ id: 1 })).toBeNull();
    });
  });

  describe('users', () => {
    it('should return an array of users', async () => {
      const result: User[] = [];
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(result);

      expect(await service.users({})).toBe(result);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const data: Prisma.UserCreateInput = { email: 'test@example.com', username: 'test', password: 'password' };
      const result = { id: 1, ...data } as User;

      jest.spyOn(prisma.user, 'create').mockResolvedValue(result);

      expect(await service.createUser(data)).toBe(result);
      expect(prisma.user.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const params = { where: { id: 1 }, data: { email: 'updated@example.com' } };
      const result = { id: 1, email: 'updated@example.com', username: 'test', password: 'password' } as User;

      jest.spyOn(prisma.user, 'update').mockResolvedValue(result);

      expect(await service.updateUser(params)).toBe(result);
      expect(prisma.user.update).toHaveBeenCalledWith(params);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = { id: 1, email: 'test@example.com', username: 'test', password: 'password' } as User;

      jest.spyOn(prisma.user, 'delete').mockResolvedValue(result);

      expect(await service.deleteUser({ id: 1 })).toBe(result);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const result = { id: 1, email: 'test@example.com', username: 'test', password: 'password' } as User;
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(result);

      expect(await service.findOne('test')).toBe(result);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      expect(await service.findOne('test')).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [];
      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });
});
