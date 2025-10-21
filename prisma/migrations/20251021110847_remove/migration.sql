/*
  Warnings:

  - You are about to drop the column `lessonId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_lessonId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "lessonId";
