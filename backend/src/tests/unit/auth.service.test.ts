import bcrypt from 'bcryptjs';
import { AuthService } from '../../services/auth.service';
import { UserRepository } from '../../repositories/user.repository';
import { mailer } from '../../emails/mailer';
import * as jwtUtils from '../../utils/jwt';

// Mock dependencies
jest.mock('../../repositories/user.repository');
jest.mock('../../emails/mailer');
jest.mock('../../config/database', () => ({
  prisma: {
    refreshToken: {
      create: jest.fn(),
      updateMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const mockUserRepo = UserRepository as jest.MockedClass<typeof UserRepository>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'Rahul',
        lastName: 'Sharma',
        email: 'rahul@example.com',
        password: 'Password123',
        phone: '9876543210',
      };

      mockUserRepo.prototype.findByEmail.mockResolvedValue(null);
      mockUserRepo.prototype.create.mockResolvedValue({
        id: 'uuid-1',
        ...userData,
        password: 'hashed',
        role: 'CUSTOMER',
        isEmailVerified: false,
        emailVerifyToken: null,
        emailVerifyExpiry: null,
        profileImage: null,
        isActive: true,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        addresses: [],
      } as unknown as ReturnType<typeof mockUserRepo.prototype.create> extends Promise<infer T> ? T : never);

      (mailer.sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.register(userData);

      expect(result.email).toBe(userData.email);
      expect((result as { password?: string }).password).toBeUndefined();
      expect(mailer.sendVerificationEmail).toHaveBeenCalledWith(
        userData.email,
        userData.firstName,
        expect.any(String),
      );
    });

    it('should throw ConflictError if email already exists', async () => {
      mockUserRepo.prototype.findByEmail.mockResolvedValue({ id: 'existing' } as never);

      await expect(
        authService.register({
          firstName: 'Test',
          lastName: 'User',
          email: 'existing@example.com',
          password: 'Password123',
        }),
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const hashed = await bcrypt.hash('Password123', 10);

      mockUserRepo.prototype.findByEmail.mockResolvedValue({
        id: 'uuid-1',
        email: 'rahul@example.com',
        password: hashed,
        firstName: 'Rahul',
        lastName: 'Sharma',
        role: 'CUSTOMER',
        isActive: true,
        isEmailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpiry: null,
        profileImage: null,
        deletedAt: null,
        phone: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        addresses: [],
      } as never);

      const { prisma } = require('../../config/database');
      prisma.refreshToken.create.mockResolvedValue({});

      const result = await authService.login('rahul@example.com', 'Password123');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe('rahul@example.com');
    });

    it('should throw UnauthorizedError with wrong password', async () => {
      const hashed = await bcrypt.hash('CorrectPassword123', 10);
      mockUserRepo.prototype.findByEmail.mockResolvedValue({
        id: 'uuid-1',
        password: hashed,
        isActive: true,
      } as never);

      await expect(authService.login('test@example.com', 'WrongPassword')).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should throw UnauthorizedError if user not found', async () => {
      mockUserRepo.prototype.findByEmail.mockResolvedValue(null);
      await expect(authService.login('nobody@example.com', 'Password123')).rejects.toMatchObject({
        statusCode: 401,
      });
    });
  });
});
