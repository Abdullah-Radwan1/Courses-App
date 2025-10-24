/*
  Warnings:

  - You are about to drop the column `stamps` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `curriculumId` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('VIDEO', 'PDF', 'EXAM');

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "stamps",
DROP COLUMN "title",
ADD COLUMN     "curriculumId" TEXT NOT NULL,
ADD COLUMN     "period" TEXT NOT NULL,
ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'VIDEO';

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "period" TEXT NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
