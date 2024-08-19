import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => '$2b$10$fixedHashForTesting');
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user and return a JWT token', async () => {
      const registerDto = { email: 'new@test.com', password: 'password', name: 'New User' };
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const newUser: User = {
        id: 1,
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        googleId: null,
        facebookId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null); // Ensure the user does not exist
      jest.spyOn(userService, 'createUser').mockResolvedValue(newUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.register(registerDto);
      expect(result).toEqual('jwtToken');
      expect(userService.createUser).toHaveBeenCalledWith({
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: newUser.email, sub: newUser.id });
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

      await expect(authService.register({ email: 'existing@test.com', password: 'password', name: 'Existing User' }))
        .rejects
        .toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return a JWT token for valid user credentials', async () => {
      const loginDto = { email: 'test@test.com', password: 'password' };
      const user: User = {
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 10),
        name: 'Test User',
        googleId: null,
        facebookId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);
      // Mock bcrypt.compare to return true for the given password
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.login(loginDto);
      expect(result).toEqual('jwtToken');
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginDto = { email: 'test@test.com', password: 'wrongpassword' };
      const user: User = {
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash('correctpassword', 10), // Correct password for testing
        name: 'Test User',
        googleId: null,
        facebookId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(false);

      await expect(authService.login(loginDto))
        .rejects
        .toThrow(UnauthorizedException);
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

      jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 1 });
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
