import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { ConflictException } from '@nestjs/common';
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
      const newUser = {
        email: 'user@domain.com',
        password: 'password',
        name: 'User 2',
        googleId: null, // Include additional fields
        facebookId: null, // Include additional fields
        createdAt: new Date(), // Include additional fields
        updatedAt: new Date(), // Include additional fields
      };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue({ id: 1, ...newUser });
      const result = await service.createUser(newUser);
      expect(result).toEqual({ id: 1, ...newUser });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
          googleId: null,
          facebookId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
    });
    it('should throw ConflictException if user already exists', async () => {
      const newUser = {
        email: 'user@domain.com',
        password: 'password',
        name: 'User 2',
        googleId: null,
        facebookId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mocking findUnique to return an existing user
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({ id: 1, ...newUser });

      await expect(service.createUser({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
      })).rejects.toThrow(
        new ConflictException(`User with email ${newUser.email} already exists`)
      );
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
      await expect(service.findUserById(999)).rejects.toThrow('User with ID 999 not found');
    });
  });

  describe('deleteUser', () => {
    it('should remove a user by id', async () => {
      const result = await service.deleteUser(1);
      expect(result).toBeUndefined();
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should handle user not found', async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue(new Error('User not found'));
      await expect(service.deleteUser(999)).rejects.toThrow('User with ID 999 not found');
    });
  });
});
