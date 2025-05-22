# Task Management System

- Live: https://reunion-task-assignment.vercel.app/tasks
- Backend: https://reunion-task-3w4d.onrender.com

This is a Task Management System built with a full stack approach using Node.js, Express, React, Next.js, and various modern technologies. It allows users to manage tasks, track time spent, view task statistics, and more, with JWT authentication for secure access.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [Usage](#usage)
5. [Folder Structure](#folder-structure)
6. [Endpoints](#endpoints)
7. [Features](#features)
8. [License](#license)

## Tech Stack

- **Frontend:**
  - React
  - Next.js
  - Tailwind CSS
  - ShadCN (UI Library)
  - Accernity UI
- **Backend:**
  - Node.js
  - Express.js
  - JWT (JSON Web Token) for Authentication
  - Bcryptjs for Password Hashing
  - PostgreSQL for Database
  - Prisma ORM

## Installation

Follow the steps below to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-management-system.git
cd task-management-system
```

### 2. Install Dependencies

**Frontend (React + Next.js):**

```bash
cd frontend
npm install
```

**Backend (Node.js + Express):**

```bash
cd backend
npm install
```

### 3. Setup PostgreSQL Database

1. Install PostgreSQL if you don’t have it set up already.
2. Create a new database in PostgreSQL (e.g., `task_management`).
3. Set up your PostgreSQL connection in the `.env` file.

### 4. Prisma Setup

In the `backend` directory, after installing the dependencies, generate the Prisma client.

```bash
npx prisma generate
```

This will generate the Prisma client, which is used to interact with the PostgreSQL database.

### 5. Create Environment Variables

In the root of both `frontend` and `backend` directories, create `.env` files and define the necessary variables:

#### `.env` for Backend

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/task_management?schema=public"
JWT_SECRET="your_secret_key"
```

#### `.env` for Frontend (Optional)

```env
NEXT_PUBLIC_API_URL="http://localhost:5000" # API URL for the backend
```

### 6. Run the Application

Start the backend and frontend servers.

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

Now, the frontend will be running on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Usage

- **Authentication**: Users can sign up and log in to the system using JWT authentication.
- **Task Management**: Users can create, update, and delete tasks. Tasks have attributes such as `title`, `description`, `status`, `startDate`, `endDate`, and `priority`.
- **Statistics**: View statistics on tasks such as the total number of tasks, completion rate, average time per task, and pending tasks with time estimates.

### Key Features

1. **Create Task**: Allows users to create tasks with the following properties:
   - `title`
   - `description`
   - `status` (Pending, Completed)
   - `startDate` and `endDate`
   - `priority`
2. **Update Task**: Users can update existing tasks.

3. **Delete Task**: Tasks can be deleted when no longer required.

4. **Sort Tasks**: Sort tasks based on:

   - `startDate` (Ascending/Descending)
   - `endDate` (Ascending/Descending)

5. **Filter Tasks**:

   - By `status` (Completed, Pending)
   - By `priority`

6. **Statistics Page**: Display detailed statistics for tasks:
   - Total Tasks: Total number of tasks
   - Task Completed: Number of completed tasks
   - Task Pending: Number of pending tasks
   - Completed Percentage: Percentage of tasks completed
   - Pending Percentage: Percentage of tasks pending
   - Average Completion Time: Average time taken to complete tasks (in hours)
   - Total Time Spent: Total time spent on completed tasks (in hours)
   - Total Pending Time Lapsed: Time lapsed for pending tasks (in hours)
   - Total Pending Time Remaining: Estimated remaining time for pending tasks (in hours)
   - Pending Tasks By Priority: A breakdown of pending tasks based on priority (with time lapsed and estimated time remaining for each priority level).

## Folder Structure

```
/task-management-system
│
├── /frontend                   # React + Next.js Frontend
│   ├── /pages                  # React Pages
│   ├── /components             # UI Components
│   ├── /styles                 # Tailwind and CSS Styles
│   ├── /public                 # Static Files
│   ├── .env                    # Frontend environment variables
│   └── package.json            # Frontend dependencies and scripts
│
└── /backend                    # Node.js + Express Backend
    ├── /controllers            # Express route controllers
    ├── /middleware             # Custom middlewares (e.g., auth)
    ├── /models                 # Prisma models and database schema
    ├── /routes                 # API routes
    ├── /services               # Business logic and services
    ├── .env                    # Backend environment variables
    ├── package.json            # Backend dependencies and scripts
    └── prisma                   # Prisma schema and migration files
```

## Endpoints

### Auth Routes

- **POST /auth/signup**: Sign up a new user.
- **POST /auth/login**: Login with credentials and receive a JWT token.

### Task Routes

- **GET /tasks**: Get all tasks for the authenticated user.
- **GET /tasks/:id**: Get a specific task by ID.
- **POST /tasks**: Create a new task.
- **PUT /tasks/:id**: Update an existing task.
- **DELETE /tasks/:id**: Delete a task.

### Stats Routes

- **GET /stats**: Get task statistics including:
  - Total tasks
  - Percent of completed and pending tasks
  - Time lapsed for pending tasks and estimated time to finish

### Auth Middleware

- Protects routes by ensuring a valid JWT token is present in the request header.

## License

MIT License
