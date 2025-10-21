"use server";

import { db } from "../../../prisma/db";
import { getCurrentUser } from "./enrollmentActions";

export const createCommentAction = async ({
  courseId,
  content,
}: {
  courseId: string;
  content: string;
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be logged in to comment");

  return db.comment.create({
    data: { content, courseId, userId: user.id },
    include: { user: true }, // so frontend can display user info
  });
};

export const getCommentsByCourseAction = async ({
  courseId,
  page = 1,
  take = 3,
}: {
  courseId: string;
  page: number;
  take: number;
}) => {
  const skip = (page - 1) * take;

  const comments = await db.comment.findMany({
    where: { courseId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  const totalComments = await db.comment.count({ where: { courseId } });
  const hasMore = page * take < totalComments;

  return { comments, hasMore };
};
