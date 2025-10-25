import { cache } from "react";
import { db } from "../../../prisma/db";

export const getStaticCourseData = cache(async (courseId: string) => {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      instructor: true,
      duration: true,
      language: true,
      _count: { select: { enrollments: true, curriculums: true } },
      curriculums: {
        select: {
          id: true,
          title: true,
          period: true,
          Lessons: {
            select: { id: true, name: true, period: true, type: true },
          },
        },
        orderBy: { period: "asc" },
      },
    },
  });

  const exam = await db.exam.findFirst({
    where: { courseId },
    include: { questions: { include: { options: true } } },
  });

  if (!course || !exam) throw new Error("Course or exam not found");

  // total lessons
  const totalLessons = course.curriculums.reduce(
    (sum, c) => sum + c.Lessons.length,
    0
  );

  return {
    course: {
      instructor: course.instructor,
      duration: course.duration,
      language: course.language,
      _count: { enrollments: course._count.enrollments, lessons: totalLessons },
    },
    curriculum: course.curriculums,
    examData: {
      examId: exam.id,
      title: exam.title,
      questions: exam.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options.map((o) => ({ id: o.id, text: o.text })),
      })),
    },
  };
});
