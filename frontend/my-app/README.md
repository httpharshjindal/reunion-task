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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/task`,
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
