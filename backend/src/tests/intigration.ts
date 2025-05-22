import request from 'supertest';
import express from 'express';
import authRouter from '../routes/auth';
import taskRouter from '../routes/task';
import statsRouter from '../routes/stats';
import prisma from '../lib/prismaClient';
import { hash } from 'bcryptjs';

// Add type declarations
declare global {
  namespace jest {
    interface Mock<T = any> {
      mockResolvedValue: (value: any) => Mock<T>;
      mockReturnValue: (value: any) => Mock<T>;
    }
  }
}

// Mock Prisma client
jest.mock('../lib/prismaClient');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/tasks', taskRouter);
app.use('/stats', statsRouter);

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (hash as jest.Mock).mockResolvedValue('hashedPassword123');

      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('userId');
    });

    it('should return 409 if user already exists', async () => {
      const existingUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'user Already Exists');
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'te', // too short
          email: 'invalid-email',
          password: '123' // too short
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'invalid inputs');
    });
  });

  describe('POST /auth/signin', () => {
    it('should sign in user successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (hash as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 404 if user not found', async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'user not found');
    });

    it('should return 401 for incorrect password', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123'
      };

      (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
      (hash as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Incorrect Password');
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: 'invalid-email',
          password: '' // empty password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'invalid inputs');
    });
  });
});

describe('Task Management Integration Tests', () => {
  let authToken: string;
  let userId: number;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Create a test user and get auth token
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword123'
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
    (hash as jest.Mock).mockResolvedValue('hashedPassword123');

    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = signupResponse.body.token;
    userId = signupResponse.body.userId;
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        priority: 1,
        userId: userId
      };

      (prisma.tasks.create as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'PENDING',
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000),
          priority: 1
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('task');
    });

    it('should return 400 for invalid task data', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '', // invalid empty title
          description: 'Test Description',
          status: 'INVALID_STATUS',
          startDate: 'invalid-date',
          endDate: new Date(),
          priority: 0
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid inputs');
    });
  });

  describe('GET /tasks/bulk', () => {
    it('should fetch tasks with filters', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          status: 'PENDING',
          priority: 1,
          userId: userId
        },
        {
          id: 2,
          title: 'Task 2',
          status: 'DONE',
          priority: 2,
          userId: userId
        }
      ];

      (prisma.tasks.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/tasks/bulk?priority=1&status=PENDING&order=priority-asc')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body.tasks).toHaveLength(2);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const mockUpdatedTask = {
        id: 1,
        title: 'Updated Task',
        status: 'DONE',
        priority: 2
      };

      (prisma.tasks.update as jest.Mock).mockResolvedValue(mockUpdatedTask);

      const response = await request(app)
        .put('/tasks/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task',
          status: 'DONE',
          priority: 2
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('task');
    });
  });

  describe('DELETE /tasks', () => {
    it('should delete multiple tasks', async () => {
      const mockDeleteResult = { count: 2 };

      (prisma.tasks.deleteMany as jest.Mock).mockResolvedValue(mockDeleteResult);

      const response = await request(app)
        .delete('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ids: [1, 2]
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('deletedTasksCount', 2);
    });
  });
});

describe('Stats Integration Tests', () => {
  let authToken: string;
  let userId: number;

  beforeEach(async () => {
    jest.clearAllMocks();
    // Create a test user and get auth token
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword123'
    };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
    (hash as jest.Mock).mockResolvedValue('hashedPassword123');

    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = signupResponse.body.token;
    userId = signupResponse.body.userId;
  });

  describe('GET /stats', () => {
    it('should return task statistics', async () => {
      const mockTasks = [
        {
          id: 1,
          status: 'DONE',
          startDate: new Date(Date.now() - 86400000),
          endDate: new Date(),
          priority: 1,
          userId: userId
        },
        {
          id: 2,
          status: 'PENDING',
          startDate: new Date(Date.now() - 43200000),
          endDate: new Date(Date.now() + 43200000),
          priority: 2,
          userId: userId
        }
      ];

      (prisma.tasks.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('stats');
      expect(response.body.stats).toHaveProperty('totalTasks', 2);
      expect(response.body.stats).toHaveProperty('taskCompleted', 1);
      expect(response.body.stats).toHaveProperty('taskPending', 1);
    });

    it('should return empty stats when no tasks exist', async () => {
      (prisma.tasks.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.stats).toHaveProperty('totalTasks', 0);
      expect(response.body.stats).toHaveProperty('taskCompleted', 0);
      expect(response.body.stats).toHaveProperty('taskPending', 0);
    });
  });
});
