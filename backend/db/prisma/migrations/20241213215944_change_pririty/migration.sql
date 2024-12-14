/*
  Warnings:

  - The `priority` column on the `Tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "priority",
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 1;

-- DropEnum
DROP TYPE "PRIORITY";
