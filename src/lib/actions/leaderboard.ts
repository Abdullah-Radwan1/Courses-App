// app/lib/getLeaderboard.ts

import { cache } from "react";
import { db } from "../../../prisma/db";

export const getLeaderboard = cache(async function (
  courseId: string,
  page = 1,
  take = 6
) {
  const skip = (page - 1) * take;

  const leaderboard = await db.examResult.findMany({
    where: { exam: { courseId } },
    orderBy: { score: "desc" },
    skip,
    take: take,
    select: {
      score: true,
      rank: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      createdAt: true,
    },
  });

  const total = await db.examResult.count({
    where: { exam: { courseId } },
  });

  return {
    leaderboard,
    pagination: {
      total,
      totalPages: Math.ceil(total / take),
      currentPage: page,
      take,
    },
  };
});
