import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '@prisma/client';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue({ id: 1, email: 'user@domain.com', name: 'User 1' }),
            findUserById: jest.fn().mockResolvedValue({ id: 1, email: 'user@domain.com', name: 'User 1' }),
            deleteUser: jest.fn().mockResolvedValue({ id: 1, email: 'user@domain.com', name: 'User 1' }),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = { email: 'user@domain.com', password: 'password', name: 'User 1' };
      const result = await userController.createUser(createUserDto);
      expect(result).toEqual({ id: 1, email: 'user@domain.com', name: 'User 1' });
    });
  });

  describe('findUserById', () => {
    it('should return a user by id', async () => {
      const result = await userController.findUserById(1);
      expect(result).toEqual({ id: 1, email: 'user@domain.com', name: 'User 1' });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const result = await userController.deleteUser(1);
      expect(result).toBeUndefined();
      expect(userService.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
