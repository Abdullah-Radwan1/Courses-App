"use server";
import { cache } from "react";
import { db } from "../../../prisma/db";
import { getCurrentUser } from "./userAction";
import { revalidatePath } from "next/cache";
import { Type } from "@/generated/prisma";

export const getCoursesAction = cache(async (courseId: string) => {
  return db.course
    .findUnique({
      where: { id: courseId },
      select: {
        instructor: true,
        duration: true,
        language: true,
        _count: {
          select: {
            enrollments: true,
            curriculums: true, // optional if you want number of curriculums
          },
        },
        curriculums: {
          select: {
            Lessons: {
              select: { id: true },
              where: { type: "VIDEO" }, // we only need the count
            },
          },
        },
      },
    })
    .then((course) => {
      if (!course) return null;

      // Compute total lessons
      const totalLessons = course.curriculums.reduce(
        (sum, cur) => sum + cur.Lessons.length,
        0
      );

      return {
        instructor: course.instructor,
        duration: course.duration,
        language: course.language,
        _count: {
          enrollments: course._count.enrollments,
          lessons: totalLessons,
        },
      };
    });
});

// server action
export const getCourseCurriculum = async (courseId: string) => {
  const { id } = await getCurrentUser();
  return db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      curriculums: {
        select: {
          id: true,
          title: true,
          period: true,
          Lessons: {
            select: {
              id: true,
              name: true,
              period: true,
              type: true,
              LessonCompletion: {
                where: { userId: id },
                select: { completed: true },
              },
            },
            orderBy: { period: "asc" },
          },
        },
        orderBy: { period: "asc" },
      },
    },
  });
};

export async function getCourseProgress(courseId: string) {
  const { id } = await getCurrentUser();
  const totalLessons = await db.lesson.count({
    where: { courseId, type: { in: [Type.VIDEO, Type.EXAM] } },
  });

  // عدد الدروس المكتملة من قبل المستخدم
  const completedLessons = await db.lessonCompletion.count({
    where: {
      userId: id,
      lesson: {
        courseId,
        type: { in: [Type.VIDEO, Type.EXAM] }, // ✅ multiple types
      },
      completed: true,
    },
  });

  const progress = Number(((completedLessons / totalLessons) * 100).toFixed(2));
  return progress; // النسبة المئوية
}

export async function toggleLessonCompletion(lessonId: string) {
  try {
    // Check if completion already exists
    const { id } = await getCurrentUser();

    return await db.lessonCompletion.upsert({
      where: {
        userId_lessonId: { userId: id, lessonId }, // composite unique constraint
      },
      update: { completed: true }, // mark as completed
      create: {
        userId: id,
        lessonId,
        completed: true, // default value when creating
      },
    });
  } catch (error) {
    console.error("Error toggling lesson completion:", error);
    throw new Error("Failed to update lesson completion");
  }
}
