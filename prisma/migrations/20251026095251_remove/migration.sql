/*
  Warnings:

  - You are about to drop the column `leaderboardId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `leaderboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_leaderboardId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "leaderboardId";

-- DropTable
DROP TABLE "public"."leaderboard";
