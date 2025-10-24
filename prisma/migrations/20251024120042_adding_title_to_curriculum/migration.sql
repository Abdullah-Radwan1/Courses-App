/*
  Warnings:

  - You are about to drop the column `name` on the `Curriculum` table. All the data in the column will be lost.
  - Added the required column `name` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Curriculum" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'course';

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "name" TEXT NOT NULL;
