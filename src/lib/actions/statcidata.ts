import { cache } from "react";
import { db } from "../../../prisma/db";

export const getStaticCourseData = cache(async (courseId: string) => {
  const takeC = 3;
  const pageC = 1;
  const skipC = (pageC - 1) * takeC;

  // ✅ Execute all queries in a single transaction for performance
  const [course, commentsWithUser, totalComments] = await db.$transaction([
    db.course.findUnique({
      where: { id: courseId },
      select: {
        instructor: true,
        duration: true,
        language: true,
        Exam: { select: { id: true } },
        _count: {
          select: { enrollments: true, curriculums: true },
        },
        curriculums: {
          select: {
            id: true,
            title: true,
            period: true,
            Lessons: {
              select: {
                id: true,
                url: true,
                name: true,
                period: true,
                type: true,
              },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { period: "asc" },
        },
      },
    }),

    db.comment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: skipC,
      take: takeC,
    }),

    db.comment.count({ where: { courseId } }),
  ]);

  if (!course) throw new Error("Course or examId not found");

  const totalLessons = course.curriculums.reduce(
    (sum, c) => sum + c.Lessons.length,
    0
  );

  const hasMoreComments = pageC * takeC < totalComments;

  return {
    course: {
      instructor: course.instructor,
      duration: course.duration,
      language: course.language,
      _count: {
        enrollments: course._count.enrollments,
        lessons: totalLessons,
      },
    },
    examId: course.Exam[0].id,

    curriculum: course.curriculums,

    comments: {
      commentsWithUser,
      hasMore: hasMoreComments,
    },
  };
});
