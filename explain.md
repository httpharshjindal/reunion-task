# Task Management System

A full-stack task management application built with React, TypeScript, Express, and Prisma.

## System Architecture

### Backend (Node.js + Express + TypeScript)

#### 1. Authentication System
- Uses JWT (JSON Web Tokens) for secure authentication
- Password hashing with bcryptjs
- Protected routes using middleware

```typescript
// Example of protected route
app.use("/api/v1/task", authMiddleware, taskRouter);
```

#### 2. Database (Prisma ORM)
- Uses Prisma as the ORM for database operations
- PostgreSQL database
- Type-safe database queries

```typescript
// Example of database query
const user = await prisma.user.create({
  data: {
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  },
});
```

#### 3. API Endpoints
- RESTful API design
- Versioned API routes (/api/v1/...)
- Main endpoints:
  - `/api/v1/auth` - Authentication routes
  - `/api/v1/task` - Task management routes
  - `/api/v1/stats` - Statistics and analytics routes

### Frontend (React + TypeScript)

#### 1. Authentication Flow
- JWT token storage in localStorage
- Protected routes using React Router
- Automatic token refresh mechanism

#### 2. State Management
- React Context for global state
- Local state for component-specific data

#### 3. API Integration
- Axios for HTTP requests
- Interceptors for token management
- Error handling middleware

## Key Features

1. **User Authentication**
   - Sign up
   - Sign in
   - Password hashing
   - JWT-based session management

2. **Task Management**
   - Create tasks
   - Update task status
   - Delete tasks
   - Task filtering and sorting
   - Priority levels
   - Due dates

3. **Statistics and Analytics**
   - Task completion rates
   - Performance metrics
   - Progress tracking

## Security Features

1. **Authentication**
   - JWT token validation
   - Password hashing
   - Protected routes
   - Token expiration

2. **Data Validation**
   - Input validation using Zod
   - Type safety with TypeScript
   - SQL injection prevention through Prisma

## Development Workflow

1. **Backend Development**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Environment Variables

### Backend (.env)
