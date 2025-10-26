import { db } from "../../../prisma/db";
import { getCurrentUser } from "./userAction";

export async function getUserSpecificData(courseId: string, examId: string) {
  const { id } = await getCurrentUser();

  const [completedLessons, totalLessons, alreadyExamed] = await db.$transaction(
    [
      db.lessonCompletion.findMany({
        where: {
          userId: id,
          lesson: { courseId, type: "VIDEO" },
          completed: true,
        },
      }),
      db.lesson.count({ where: { courseId, type: "VIDEO" } }),
      db.examResult.findUnique({
        select: { id: true },
        where: { userId_examId: { userId: id, examId: examId } },
      }),
    ]
  );

  return {
    completedLessons,
    totalLessons,
    alreadyExamed: !!alreadyExamed,
  };
}
