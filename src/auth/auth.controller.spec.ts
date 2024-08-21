import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
            findUserById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(), // Ensure this is correctly mocked
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token for valid user credentials', async () => {
      const user: User = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
        googleId: null,
        facebookId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.login({ email: 'test@test.com', password: 'password' });
      expect(result).toEqual('jwtToken');
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);

      await expect(authService.login({ email: 'wrong@test.com', password: 'wrongpassword' }))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user and return a JWT token', async () => {
      const newUser: User = {
        id: 1,
        email: 'new@test.com',
        password: 'hashedPassword',
        name: 'New User',
        googleId: null,
        facebookId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null); // Upewniamy się, że użytkownik nie istnieje
      jest.spyOn(userService, 'createUser').mockResolvedValue(newUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.registerUser({ email: 'new@test.com', password: 'password', name: 'New User' });
      expect(result).toEqual('jwtToken');
      expect(userService.createUser).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: expect.any(String),
        name: 'New User',
      });
    });

    it('should throw a ConflictException if the email is already in use', async () => {
      const existingUser: User = {
        id: 1,
        email: 'existing@test.com',
        password: 'hashedPassword',
        name: 'Existing User',
        googleId: null,
        facebookId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(existingUser);

      await expect(authService.registerUser({ email: 'existing@test.com', password: 'password', name: 'Existing User' }))
        .rejects
        .toThrow(ConflictException);
    });
  });

  describe('validateToken', () => {
    it('should return a user if token is valid', async () => {
      const user: User = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        name: 'Test User',
        googleId: null,
        facebookId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 1 }); // Mock the return value of verify
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);

      const result = await authService.validateToken('validToken');
      expect(result).toEqual(user);
    });

    it('should throw an UnauthorizedException if token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.validateToken('invalidToken'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});
