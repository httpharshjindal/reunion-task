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


# Frontend

# Task Management System

A modern and efficient task management system built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **User Authentication**
  - Secure login and registration system
  - JWT-based authentication
  - Protected routes

- **Task Management**
  - Create, read, update, and delete tasks
  - Task prioritization (1-5 levels)
  - Task status tracking (Pending/Done)
  - Date-based task scheduling
  - Task descriptions and titles

- **Modern UI/UX**
  - Responsive design
  - Clean and intuitive interface
  - Loading states and error handling
  - Form validation
  - Date picker integration

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Date Handling**: Custom DatePicker component

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard routes
│   ├── auth/              # Authentication routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── CreateDialog.tsx  # Task creation dialog
│   ├── EditDialog.tsx    # Task editing dialog
│   ├── DatePicker.tsx    # Custom date picker
│   └── Top-nav-bar.tsx   # Navigation component
├── lib/                  # Utility functions and configurations
└── public/              # Static assets
```

## 🔑 Key Components

### CreateDialog.tsx
```typescript
"use client";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "./ui/switch";
import { DatePicker } from "./DatePicker";

export function CreateDialog() {
  // State management
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [priority, setPriority] = useState<number>();
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  
  // Form validation states
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isStartDateValid, setIsStartDateValid] = useState(true);
  const [isEndDateValid, setIsEndDateValid] = useState(true);
  const [isPriorityValid, setIsPriorityValid] = useState(true);

  // API call to create task
  const sendRequest = async () => {
    // Validation logic
    if (titleValid && priority && startDateValid && endDateValid) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/task`,
          {
            title,
            description,
            status,
            startDate,
            endDate,
            priority,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (response.status >= 200 && response.status < 300) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }
  };

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Form fields */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter task title"
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            {/* Other form fields */}
          </div>
        </div>
        <Button onClick={sendRequest}>Create Task</Button>
      </DialogContent>
    </Dialog>
  );
}
```

### EditDialog.tsx
- Task modification interface
- Pre-filled form data
- Update functionality

### DatePicker.tsx
```typescript
"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePicker({ onSelect }: { onSelect: (date: Date | undefined) => void }) {
  const [date, setDate] = React.useState<Date>();

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onSelect(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
```

### Top-nav-bar.tsx
```typescript
"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function TopNavBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const navigation = [
    { name: "Statistics", href: "/stats" },
    { name: "Tasks", href: "/tasks" },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 justify-between">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="sm:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              {/* Mobile menu items */}
            </SheetContent>
          </Sheet>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/auth/signin");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   NEXT_PUBLIC_BACKEND_URL=your_backend_url
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔒 Environment Variables

Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_BACKEND_URL=your_backend_url
```

## 📝 API Integration

The frontend communicates with the backend through RESTful APIs:
- Task CRUD operations
- User authentication
- Data validation and error handling

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Loading states for better user experience
- Form validation with error messages
- Intuitive task management interface
- Clean and modern design using Tailwind CSS

## 🔄 State Management

- React Hooks for local state management
- Form state handling
- Loading and error states
- Authentication state

## 🛠️ Development

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component-based architecture
- Modular and reusable components

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

