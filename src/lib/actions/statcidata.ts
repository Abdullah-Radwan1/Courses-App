import { cache } from "react";
import { db } from "../../../prisma/db";

export const getStaticCourseData = cache(async (courseId: string) => {
  const takeQ = 3;
  const pageQ = 1;
  const skipQ = (pageQ - 1) * takeQ;

  const takeC = 3;
  const pageC = 1;
  const skipC = (pageC - 1) * takeC;

  const takeL = 6; // ✅ leaderboard page size
  const pageL = 1;
  const skipL = (pageL - 1) * takeL;

  // ✅ Execute all queries in a single transaction for performance
  const [
    course,
    exam,
    questionWithUser,
    totalQuestions,
    commentsWithUser,
    totalComments,
    leaderboard,
  ] = await db.$transaction([
    db.course.findUnique({
      where: { id: courseId },
      select: {
        instructor: true,
        duration: true,
        language: true,
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
            },
          },
          orderBy: { period: "asc" },
        },
      },
    }),

    db.exam.findFirst({
      where: { courseId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    }),

    db.question.findMany({
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
      skip: skipQ,
      take: takeQ,
    }),

    db.question.count({ where: { courseId } }),

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

    // ✅ Leaderboard query
    db.examResult.findMany({
      where: { exam: { courseId } },
      orderBy: { score: "desc" },
      skip: skipL,
      take: takeL,
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
    }),
  ]);

  if (!course || !exam) throw new Error("Course or exam not found");

  const totalLessons = course.curriculums.reduce(
    (sum, c) => sum + c.Lessons.length,
    0
  );

  const hasMoreQuestions = pageQ * takeQ < totalQuestions;
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
    curriculum: course.curriculums,
    examData: {
      examId: exam.id,
      title: exam.title,
      questions: exam.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
        })),
      })),
    },
    questionsData: {
      questionWithUser,
      hasMore: hasMoreQuestions,
    },
    comments: {
      commentsWithUser,
      hasMore: hasMoreComments,
    },
    leaderboard: {
      leaderboard,
      pagination: {
        currentPage: pageL,
        take: takeL,
      },
    },
  };
});
