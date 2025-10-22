"use server";

import { db } from "../../../prisma/db";
import { getCurrentUser } from "./userAction";

export const createQuestionAction = async ({
  courseId,
  content,
}: {
  courseId: string;
  content: string;
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be logged in to ask a question");

  return db.question.create({
    data: { content, courseId, userId: user.id },
    include: { user: true }, // so frontend can display user info
  });
};

export const getQuestionsByCourseAction = async ({
  courseId,
  page = 1,
  take = 3,
}: {
  courseId: string;
  page: number;
  take: number;
}) => {
  const skip = (page - 1) * take;

  const questionWithUser = await db.question.findMany({
    where: { courseId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true, // optional — only if you need it
          // ❌ no password, no emailVerified, etc.
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  const totalQuestions = await db.question.count({ where: { courseId } });
  const hasMore = page * take < totalQuestions;

  return { questionWithUser, hasMore };
};
