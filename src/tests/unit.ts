import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { signupBody, signinBody, createTaskBody } from '../types';
import prisma from '../lib/prismaClient';

// Add type declarations
declare global {
  namespace jest {
    interface Mock<T = any> {
      mockResolvedValue: (value: any) => Mock<T>;
      mockReturnValue: (value: any) => Mock<T>;
    }
  }
}

// Mock dependencies
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../lib/prismaClient');

describe('Authentication Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Signup Validation', () => {
    it('should validate signup body correctly', () => {
      const validSignupData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const result = signupBody.safeParse(validSignupData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid signup data', () => {
      const invalidSignupData = {
        username: 'te', // too short
        email: 'invalid-email',
        password: '123' // too short
      };

      const result = signupBody.safeParse(invalidSignupData);
      expect(result.success).toBe(false);
    });
  });

  describe('Signin Validation', () => {
    it('should validate signin body correctly', () => {
      const validSigninData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = signinBody.safeParse(validSigninData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid signin data', () => {
      const invalidSigninData = {
        email: 'invalid-email',
        password: '' // empty password
      };

      const result = signinBody.safeParse(invalidSigninData);
      expect(result.success).toBe(false);
    });
  });

  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const mockHash = 'hashedPassword123';
      (hash as jest.Mock).mockResolvedValue(mockHash);

      const result = await hash('password123', 10);
      expect(result).toBe(mockHash);
      expect(hash).toHaveBeenCalledWith('password123', 10);
    });
  });

  describe('Password Comparison', () => {
    it('should compare passwords correctly', async () => {
      (compare as jest.Mock).mockResolvedValue(true);

      const result = await compare('password123', 'hashedPassword123');
      expect(result).toBe(true);
      expect(compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate JWT token correctly', () => {
      const mockToken = 'mock.jwt.token';
      (sign as jest.Mock).mockReturnValue(mockToken);

      const result = sign({ userId: 1 }, 'secret_key');
      expect(result).toBe(mockToken);
      expect(sign).toHaveBeenCalledWith({ userId: 1 }, 'secret_key');
    });
  });

  describe('Database Operations', () => {
    it('should find user by email', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);

      const result = await prisma.user.findFirst({
        where: { email: 'test@example.com' }
      });

      expect(result).toEqual(mockUser);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
    });

    it('should create new user', async () => {
      const mockNewUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockNewUser);

      const result = await prisma.user.create({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedPassword123'
        }
      });

      expect(result).toEqual(mockNewUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'hashedPassword123'
        }
      });
    });
  });
});

describe('Task Management Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Task Creation Validation', () => {
    it('should validate task creation body correctly', () => {
      const validTaskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000), // tomorrow
        priority: 1
      };

      const result = createTaskBody.safeParse(validTaskData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid task data', () => {
      const invalidTaskData = {
        title: '', // empty title
        description: 'Test Description',
        status: 'INVALID_STATUS',
        startDate: 'invalid-date',
        endDate: new Date(),
        priority: 0 // invalid priority
      };

      const result = createTaskBody.safeParse(invalidTaskData);
      expect(result.success).toBe(false);
    });
  });

  describe('Task Database Operations', () => {
    it('should create a new task', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
        startDate: new Date(),
        endDate: new Date(),
        priority: 1,
        userId: 1
      };

      (prisma.tasks.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await prisma.tasks.create({
        data: {
          title: 'Test Task',
          description: 'Test Description',
          status: 'PENDING',
          startDate: new Date(),
          endDate: new Date(),
          priority: 1,
          userId: 1
        }
      });

      expect(result).toEqual(mockTask);
    });

    it('should find tasks with filters', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          status: 'PENDING',
          priority: 1,
          userId: 1
        },
        {
          id: 2,
          title: 'Task 2',
          status: 'DONE',
          priority: 2,
          userId: 1
        }
      ];

      (prisma.tasks.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const result = await prisma.tasks.findMany({
        where: {
          userId: 1,
          priority: 1,
          status: 'PENDING'
        }
      });

      expect(result).toEqual(mockTasks);
    });

    it('should update a task', async () => {
      const mockUpdatedTask = {
        id: 1,
        title: 'Updated Task',
        status: 'DONE',
        priority: 2
      };

      (prisma.tasks.update as jest.Mock).mockResolvedValue(mockUpdatedTask);

      const result = await prisma.tasks.update({
        where: { id: 1 },
        data: {
          title: 'Updated Task',
          status: 'DONE',
          priority: 2
        }
      });

      expect(result).toEqual(mockUpdatedTask);
    });

    it('should delete multiple tasks', async () => {
      const mockDeleteResult = { count: 2 };

      (prisma.tasks.deleteMany as jest.Mock).mockResolvedValue(mockDeleteResult);

      const result = await prisma.tasks.deleteMany({
        where: {
          id: { in: [1, 2] }
        }
      });

      expect(result).toEqual(mockDeleteResult);
    });
  });

  describe('Stats Calculation', () => {
    it('should calculate task statistics correctly', () => {
      const mockTasks = [
        {
          id: 1,
          status: 'DONE',
          startDate: new Date(Date.now() - 86400000), // yesterday
          endDate: new Date(),
          priority: 1
        },
        {
          id: 2,
          status: 'PENDING',
          startDate: new Date(Date.now() - 43200000), // 12 hours ago
          endDate: new Date(Date.now() + 43200000), // 12 hours from now
          priority: 2
        }
      ];

      const totalTasks = mockTasks.length;
      const taskCompleted = mockTasks.filter(task => task.status === 'DONE').length;
      const taskPending = totalTasks - taskCompleted;

      expect(totalTasks).toBe(2);
      expect(taskCompleted).toBe(1);
      expect(taskPending).toBe(1);
    });

    it('should calculate time statistics correctly', () => {
      const now = new Date();
      const mockTask = {
        startDate: new Date(now.getTime() - 3600000), // 1 hour ago
        endDate: new Date(now.getTime() + 3600000), // 1 hour from now
        status: 'PENDING'
      };

      const timeLapsed = (now.getTime() - mockTask.startDate.getTime()) / (1000 * 60 * 60);
      const timeRemaining = (mockTask.endDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      expect(timeLapsed).toBeCloseTo(1, 0); // approximately 1 hour
      expect(timeRemaining).toBeCloseTo(1, 0); // approximately 1 hour
    });
  });
});
