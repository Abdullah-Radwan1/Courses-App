/*
  Warnings:

  - You are about to drop the column `content` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stamps` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_courseId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "content",
ADD COLUMN     "stamps" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."VerificationToken";
