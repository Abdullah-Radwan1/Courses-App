import { db } from "../../../prisma/db";
import { getCurrentUser } from "./userAction";

export async function getUserSpecificData(courseId: string, examId: string) {
  const { id } = await getCurrentUser();

  const [completedLessons, totalLessonsCount, alreadyExamed] =
    await db.$transaction([
      db.lessonCompletion.findMany({
        where: {
          userId: id,
          lesson: { courseId, type: "VIDEO" },
          completed: true,
        },
      }),
      db.lesson.count({ where: { courseId, type: "VIDEO" } }),
      db.examResult.findUnique({
        where: { userId_examId: { userId: id, examId: examId } },
      }),
    ]);

  const comments = await db.comment.findMany({
    where: { courseId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  return {
    commentsData: { comments, hasMore: comments.length >= 3 },
    progress:
      totalLessonsCount === 0
        ? 0
        : Number(
            ((completedLessons.length / totalLessonsCount) * 100).toFixed(2)
          ),
    alreadyExamed: !!alreadyExamed,
    completedLessons,
  };
}
