/*
  Warnings:

  - You are about to drop the `LessonCompletion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."LessonCompletion" DROP CONSTRAINT "LessonCompletion_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."LessonCompletion" DROP CONSTRAINT "LessonCompletion_userId_fkey";

-- DropTable
DROP TABLE "public"."LessonCompletion";
