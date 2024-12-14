-- CreateEnum
CREATE TYPE "PRIORITY" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PENDING', 'DONE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "STATUS" DEFAULT 'PENDING',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "updatedTime" TIMESTAMP(3),
    "priority" "PRIORITY" DEFAULT 'ONE',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
