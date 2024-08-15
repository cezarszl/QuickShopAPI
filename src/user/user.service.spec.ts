import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

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
              create: jest.fn().mockResolvedValue({ id: 1, email: 'user@domain.com', password: 'password', name: 'User 2' }),
              findUnique: jest.fn().mockResolvedValue({ id: 1, email: 'user@domain.com', password: 'password', name: 'User 2' }),
              delete: jest.fn().mockResolvedValue({ id: 1, email: 'user@domain.com', password: 'password', name: 'User 2' }),
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

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const newUser = { email: 'user@domain.com', password: 'password', name: 'User 2' };
      const result = await service.createUser(newUser);
      expect(result).toEqual({ id: 1, email: 'user@domain.com', password: 'password', name: 'User 2' });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
        },
      });
    });
  });

  describe('findUserById', () => {
    it('should return a single user by id', async () => {
      const user = await service.findUserById(1);
      expect(user).toEqual({ id: 1, email: 'user@domain.com', password: 'password', name: 'User 2' });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should handle user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findUserById(999)).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should remove a user by id', async () => {
      const result = await service.deleteUser(1);
      expect(result).toEqual({ id: 1, email: 'user@domain.com', password: 'password', name: 'User 2' });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should handle user not found', async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('User not found'));
      await expect(service.deleteUser(999)).rejects.toThrow('User not found');
    });
  });
});
