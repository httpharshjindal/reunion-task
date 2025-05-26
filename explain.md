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

## Request Flow Diagrams

### 1. Authentication Flow

```
[Frontend]                    [Backend]
+--------+                    +--------+
|        |                    |        |
|  User  |                    | Server |
|        |                    |        |
+--------+                    +--------+
     |                             |
     |  1. Login Request          |
     |  POST /api/v1/auth/signin  |
     |  {email, password}         |
     |--------------------------->|
     |                           |
     |  2. Validate Credentials  |
     |     - Check email         |
     |     - Verify password     |
     |                           |
     |  3. Generate JWT Token    |
     |     {userId, token}       |
     |<---------------------------|
     |                           |
     |  4. Store Token           |
     |     localStorage.setItem() |
     |                           |
```

### 2. Protected API Request Flow

```
[Frontend]                    [Backend]
+--------+                    +--------+
|        |                    |        |
|  User  |                    | Server |
|        |                    |        |
+--------+                    +--------+
     |                             |
     |  1. API Request            |
     |  GET /api/v1/tasks         |
     |  Headers:                  |
     |  Authorization: Bearer <token>|
     |--------------------------->|
     |                           |
     |  2. Auth Middleware       |
     |     - Validate token      |
     |     - Extract userId      |
     |                           |
     |  3. Process Request       |
     |     - Query Database      |
     |     - Business Logic      |
     |                           |
     |  4. Send Response         |
     |     {data, status}        |
     |<---------------------------|
     |                           |
     |  5. Update UI             |
     |     - Render Data         |
     |     - Handle Errors       |
     |                           |
```

### 3. Task Creation Flow

```
[Frontend]                    [Backend]                    [Database]
+--------+                    +--------+                    +--------+
|        |                    |        |                    |        |
|  User  |                    | Server |                    | Prisma |
|        |                    |        |                    |        |
+--------+                    +--------+                    +--------+
     |                             |                             |
     |  1. Create Task Request     |                             |
     |  POST /api/v1/task          |                             |
     |  {title, description,       |                             |
     |   priority, dueDate}        |                             |
     |--------------------------->|                             |
     |                           |                             |
     |                           |  2. Validate Request        |
     |                           |     - Check auth token      |
     |                           |     - Validate input        |
     |                           |                             |
     |                           |  3. Database Operation      |
     |                           |     prisma.tasks.create()   |
     |                           |---------------------------->|
     |                           |                             |
     |                           |  4. Database Response       |
     |                           |<----------------------------|
     |                           |                             |
     |  5. Success Response      |                             |
     |     {taskId, status}      |                             |
     |<---------------------------|                             |
     |                           |                             |
     |  6. Update UI             |                             |
     |     - Add new task        |                             |
     |     - Show confirmation   |                             |
     |                           |                             |
```

### 4. Error Handling Flow

```
[Frontend]                    [Backend]
+--------+                    +--------+
|        |                    |        |
|  User  |                    | Server |
|        |                    |        |
+--------+                    +--------+
     |                             |
     |  1. Request with Error      |
     |--------------------------->|
     |                           |
     |  2. Error Detection        |
     |     - Validation Error     |
     |     - Auth Error          |
     |     - Database Error      |
     |                           |
     |  3. Error Response        |
     |     {error, status}       |
     |<---------------------------|
     |                           |
     |  4. Error Handling        |
     |     - Show Error Message  |
     |     - Retry Logic        |
     |     - Fallback UI        |
     |                           |
```

### 5. Data Flow for Task Updates

```
[Frontend]                    [Backend]                    [Database]
+--------+                    +--------+                    +--------+
|        |                    |        |                    |        |
|  User  |                    | Server |                    | Prisma |
|        |                    |        |                    |        |
+--------+                    +--------+                    +--------+
     |                             |                             |
     |  1. Update Task Request     |                             |
     |  PUT /api/v1/task/:id       |                             |
     |  {status, priority}         |                             |
     |--------------------------->|                             |
     |                           |                             |
     |                           |  2. Verify Ownership        |
     |                           |     - Check task belongs    |
     |                           |       to user              |
     |                           |                             |
     |                           |  3. Update Database        |
     |                           |     prisma.tasks.update()  |
     |                           |---------------------------->|
     |                           |                             |
     |                           |  4. Updated Data           |
     |                           |<----------------------------|
     |                           |                             |
     |  5. Success Response      |                             |
     |     {updatedTask}         |                             |
     |<---------------------------|                             |
     |                           |                             |
     |  6. Update UI             |                             |
     |     - Refresh Task List   |                             |
     |     - Show Success Msg    |                             |
     |                           |                             |
```

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
```
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
SECRET_KEY="your-jwt-secret-key"
PORT=3005
```

### Frontend (.env)
```
REACT_APP_API_URL="http://localhost:3005/api/v1"
```

## Testing

The application includes both unit and integration tests:

1. **Unit Tests**
   - Authentication logic
   - Password hashing
   - JWT token generation
   - Database operations

2. **Integration Tests**
   - API endpoints
   - Authentication flow
   - Task management operations

## Error Handling

1. **Backend**
   - Global error middleware
   - Type-safe error responses
   - Detailed error logging

2. **Frontend**
   - Error boundaries
   - Toast notifications
   - Form validation feedback

## Performance Considerations

1. **Backend**
   - Connection pooling
   - Query optimization
   - Caching strategies

2. **Frontend**
   - Code splitting
   - Lazy loading
   - Memoization
   - Optimized re-renders

## Deployment

1. **Backend**
   - Node.js environment
   - Environment variables configuration
   - Database migration

2. **Frontend**
   - Static file serving
   - Environment configuration
   - Build optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
