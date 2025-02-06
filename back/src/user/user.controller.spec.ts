import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by username', async () => {
      const result: User = { id: 1, email: 'test@example.com', username: 'test', password: 'password' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('test')).toBe(result);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await controller.findOne('test')).toBeNull();
    });
  });
});
